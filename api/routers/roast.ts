import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { env } from "../lib/env";
import { getDb } from "../queries/connection";
import { roasts, battles } from "../../db/schema";
import { desc, lt } from "drizzle-orm";

/**
 * Roast Router - Handles code roasting via Gemini API
 *
 * Endpoint: roast.generate
 * Input: { code: string, language: string }
 * Output: { roast: string, feedback: string[], severityScore: number }
 */
export const roastRouter = createRouter({
  generate: publicQuery
    .input(
      z.object({
        code: z.string().min(1, "Code cannot be empty").max(10000, "Code too long (max 10K chars)"),
        language: z.string().min(1, "Language is required"),
        personality: z.string().optional().default("Senior Dev"),
      })
    )
    .mutation(async ({ input }) => {
      const { code, language, personality } = input;

      // If no API key is configured, return a mock response for demo
      if (!env.geminiApiKeys || env.geminiApiKeys.length === 0 || env.geminiApiKeys[0] === "your_key_here") {
        return getMockRoast(code, language);
      }

      let lastError = null;
      for (const apiKey of env.geminiApiKeys) {
        try {
          const response = await callGeminiAPI(code, language, apiKey, personality);
          
          try {
            const db = getDb();
            await db.insert(roasts).values({
              codeSnippet: code,
              language,
              roastText: response.roast,
              feedback: JSON.stringify(response.feedback),
              severityScore: response.severityScore,
              personality,
            });

            // Enforce a strict limit of 50 roasts in the database to prevent free-tier overflow
            const roastsToKeep = await db.select({ id: roasts.id })
              .from(roasts)
              .orderBy(desc(roasts.id))
              .limit(50);
              
            if (roastsToKeep.length === 50) {
              const minIdToKeep = roastsToKeep[49].id;
              await db.delete(roasts).where(lt(roasts.id, minIdToKeep));
            }
          } catch (dbError) {
            console.error("Failed to save roast to DB:", dbError);
          }
          
          console.log("SUCCESSFULLY GENERATED ROAST! RETURNING:", response);
          return response;
        } catch (error) {
          console.error("Gemini API error with key:", error);
          lastError = error;
          // Loop to the next key
        }
      }

      // Fallback to mock response if all keys fail
      console.error("All Gemini API keys failed. Last error:", lastError);
      return getMockRoast(code, language);
    }),

  battle: publicQuery
    .input(
      z.object({
        code1: z.string().min(1, "Player 1 Code cannot be empty").max(5000, "Code too long"),
        code2: z.string().min(1, "Player 2 Code cannot be empty").max(5000, "Code too long"),
        language: z.string().min(1, "Language is required"),
      })
    )
    .mutation(async ({ input }) => {
      const { code1, code2, language } = input;

      // Ensure API keys are available
      if (!env.geminiApiKeys || env.geminiApiKeys.length === 0 || env.geminiApiKeys[0] === "your_key_here") {
        return getMockBattle(code1, code2, language);
      }

      let lastError = null;
      for (const apiKey of env.geminiApiKeys) {
        try {
          const response = await callGeminiBattleAPI(code1, code2, language, apiKey);
          
          try {
            const db = getDb();
            await db.insert(battles).values({
              code1,
              code2,
              language,
              winner: response.winner,
              roastText: response.roast,
              severityScore: response.severityScore,
            });

            // Cleanup old battles
            const battlesToKeep = await db.select({ id: battles.id })
              .from(battles)
              .orderBy(desc(battles.id))
              .limit(50);
              
            if (battlesToKeep.length === 50) {
              const minIdToKeep = battlesToKeep[49].id;
              await db.delete(battles).where(lt(battles.id, minIdToKeep));
            }
          } catch (dbError) {
            console.error("Failed to save battle to DB:", dbError);
          }
          
          return response;
        } catch (error) {
          console.error("Gemini API error with key:", error);
          lastError = error;
        }
      }

      console.error("All Gemini API keys failed. Last error:", lastError);
      return getMockBattle(code1, code2, language);
    }),

  getRecent: publicQuery.query(async () => {
    try {
      const recentRoasts = await getDb()
        .select()
        .from(roasts)
        .orderBy(desc(roasts.createdAt))
        .limit(20);
        
      return recentRoasts.map(r => ({
        ...r,
        feedback: JSON.parse(r.feedback) as string[]
      }));
    } catch (e) {
      console.error("Failed to fetch recent roasts", e);
      return [];
    }
  }),
});

/**
 * Call the Gemini API to generate a roast
 */
async function callGeminiAPI(
  code: string,
  language: string,
  apiKey: string,
  personality: string
): Promise<{ roast: string; feedback: string[]; severityScore: number }> {
  let personaPrompt = "You are a savage senior software developer with 15 years of experience. You roast junior developers' code brutally and hilariously.";
  
  if (personality === "Angry Tech Lead") {
    personaPrompt = "You are an angry, ruthless tech lead yelling at your team. You show absolutely no mercy and are deeply offended by this code.";
  } else if (personality === "Gen-Z Intern") {
    personaPrompt = "You are a Gen-Z intern who thinks all this code is 'mid' or 'cap'. Use heavy internet slang, skull emojis, and mock the boomer coding style.";
  } else if (personality === "Gordon Ramsay") {
    personaPrompt = "You are Gordon Ramsay, but for code. This code is so raw it's still trying to compile! Use culinary metaphors and scream about how disgusting this spaghetti code is.";
  }

  const systemPrompt = `${personaPrompt} You always follow up with genuinely helpful feedback. Never be mean-spirited or personal — roast the CODE, not the person. Pay close attention to language-specific idioms, best practices, and common mistakes to make the roast highly accurate and deeply devastating.`;

  const languageContext = language === "Auto Detect" || language === "Other" 
    ? "First, accurately identify the programming language being used. Then, roast this code based on its language's best practices." 
    : `Roast this ${language} code and give real feedback. Be specific to ${language} idioms and anti-patterns.`;

  const userPrompt = `${languageContext} Respond ONLY in this JSON format, no markdown, no backticks:
{
  "roast": "your brutal funny roast here (2-4 sentences) (if auto-detecting, cleverly mention the language you detected)",
  "feedback": ["actionable tip 1", "actionable tip 2", "actionable tip 3"],
  "severityScore": 7
}

Code:
\`\`\`
${code}
\`\`\``;

  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          responseMimeType: "application/json"
        },
      }),
    }
  );

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text();
    throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geminiData = await geminiResponse.json() as any;

  // Extract the text response from Gemini
  const textContent: string =
    geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!textContent) {
    throw new Error("Empty response from Gemini API");
  }

  // Parse the JSON response - handle potential markdown wrapping
  let parsedResponse: {
    roast: string;
    feedback: string[];
    severityScore: number;
  };

  console.log("RAW GEMINI RESPONSE FINISH REASON:", geminiData?.candidates?.[0]?.finishReason);
  console.log("RAW GEMINI RESPONSE FULL DATA:", JSON.stringify(geminiData, null, 2));

  try {
    let cleanText = textContent.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    cleanText = cleanText.trim();
    
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanText = jsonMatch[0];
    }
    
    parsedResponse = JSON.parse(cleanText);
  } catch (parseError) {
    console.error("Failed to parse Gemini response:", parseError);
    
    // Fallback: Regex extraction if JSON.parse fails due to unescaped quotes/newlines
    let extractedRoast = "Your code is so chaotic it broke my JSON parser.";
    let extractedFeedback = [
      "Use descriptive variable names instead of single letters or abbreviations",
      "Add proper error handling with try-catch blocks",
      "Break down large functions into smaller, testable units"
    ];
    let extractedScore = 5;

    try {
      const roastMatch = textContent.match(/"roast"\s*:\s*"([\s\S]*?)"\s*,\s*"feedback"/);
      if (roastMatch && roastMatch[1]) {
        extractedRoast = roastMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
      }

      const feedbackMatch = textContent.match(/"feedback"\s*:\s*\[([\s\S]*?)\]/);
      if (feedbackMatch && feedbackMatch[1]) {
        const items = feedbackMatch[1].match(/"([\s\S]*?)"/g);
        if (items && items.length > 0) {
          extractedFeedback = items.map(i => i.replace(/^"|"$/g, '').replace(/\\"/g, '"'));
        }
      }

      const scoreMatch = textContent.match(/"severityScore"\s*:\s*(\d+)/);
      if (scoreMatch && scoreMatch[1]) {
        extractedScore = parseInt(scoreMatch[1], 10);
      }
    } catch (e) {
      console.error("Regex extraction also failed", e);
    }

    parsedResponse = {
      roast: extractedRoast,
      feedback: extractedFeedback,
      severityScore: extractedScore,
    };
  }

  // Validate and sanitize the response
  return {
    roast: parsedResponse.roast || "Your code left me speechless... and not in a good way.",
    feedback: Array.isArray(parsedResponse.feedback)
      ? parsedResponse.feedback.slice(0, 5)
      : ["Add proper error handling", "Use meaningful variable names", "Consider code formatting"],
    severityScore: Math.min(10, Math.max(1, Math.round(parsedResponse.severityScore || 5))),
  };
}

/**
 * Generate a mock roast for demo/fallback purposes
 */
function getMockRoast(
  code: string,
  language: string
): { roast: string; feedback: string[]; severityScore: number } {
  const roasts = [
    `Oh wow, ${language} code that looks like it was written during a power outage. The indentation is having an identity crisis, and I'm pretty sure your variables are playing hide and seek.`,
    `I've seen spaghetti code before, but this is a whole pasta factory. Your ${language} functions are so long they need their own ZIP code.`,
    `This code is like a mystery novel — except the mystery is "what was the author thinking?" Those variable names look like you smashed your keyboard and called it a day.`,
    `Ah yes, the classic "it works on my machine" approach. Your error handling is basically just hoping nothing goes wrong. Very optimistic!`,
    `I'm not saying this ${language} code is bad, but I've seen better-organized sock drawers. At least socks come in pairs — your brackets don't even match.`,
  ];

  const feedbacks = [
    [
      "Use descriptive variable names instead of single letters or abbreviations",
      "Add proper error handling with try-catch blocks",
      "Break down large functions into smaller, testable units",
    ],
    [
      "Follow consistent code formatting and indentation standards",
      "Remove unused variables and dead code",
      "Add input validation for all user-facing functions",
    ],
    [
      "Use const/let appropriately instead of var",
      "Add comments explaining complex logic, not what the code does",
      "Consider using a linter like ESLint to catch common issues",
    ],
    [
      "Implement proper logging instead of console.log statements",
      "Handle edge cases and null/undefined values explicitly",
      "Write unit tests to verify your logic works correctly",
    ],
    [
      "Use meaningful function names that describe what they do",
      "Avoid deeply nested conditionals by using early returns",
      "Consider TypeScript for better type safety and developer experience",
    ],
  ];

  // Use code length to deterministically pick a roast
  const index = code.length % roasts.length;
  const severityScore = Math.min(10, Math.max(1, Math.floor(code.length % 8) + 2));

  return {
    roast: roasts[index],
    feedback: feedbacks[index],
    severityScore,
  };
}

/**
 * Call the Gemini API to judge a code battle
 */
async function callGeminiBattleAPI(
  code1: string,
  code2: string,
  language: string,
  apiKey: string
): Promise<{ winner: number; roast: string; severityScore: number }> {
  const systemPrompt = `You are a savage, highly experienced senior developer acting as a judge in a "Code Battle". Two developers have submitted their code snippets. You must evaluate both, pick a clear winner (the one whose code is slightly less terrible or better written), and absolutely ROAST the loser. Be hilarious, brutal, and insightful.`;

  const userPrompt = `Language: ${language}
Respond ONLY in this exact JSON format, no markdown wrapping, no backticks:
{
  "winner": 1, // or 2
  "roast": "your brutal roast of the loser, explaining why their code is worse than the winner's. 3-4 sentences.",
  "severityScore": 8 // severity of the loser's mistakes (1-10)
}

Player 1 Code:
\`\`\`
${code1}
\`\`\`

Player 2 Code:
\`\`\`
${code2}
\`\`\``;

  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.9, responseMimeType: "application/json" },
      }),
    }
  );

  if (!geminiResponse.ok) {
    throw new Error(`Gemini API error: ${geminiResponse.status}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geminiData = await geminiResponse.json() as any;
  const textContent = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  let parsedResponse = { winner: 1, roast: "You both lose.", severityScore: 10 };

  try {
    parsedResponse = JSON.parse(textContent);
  } catch (e) {
    try {
      const winnerMatch = textContent.match(/"winner"\s*:\s*(\d)/);
      const roastMatch = textContent.match(/"roast"\s*:\s*"([\s\S]*?)"\s*,/);
      const scoreMatch = textContent.match(/"severityScore"\s*:\s*(\d+)/);
      
      parsedResponse.winner = winnerMatch ? parseInt(winnerMatch[1], 10) : 1;
      parsedResponse.roast = roastMatch ? roastMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : "JSON parse failed but this code still sucks.";
      parsedResponse.severityScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 8;
    } catch (err) {
      console.error(err);
    }
  }

  return {
    winner: parsedResponse.winner === 2 ? 2 : 1,
    roast: parsedResponse.roast,
    severityScore: Math.min(10, Math.max(1, parsedResponse.severityScore || 8)),
  };
}

/**
 * Generate a mock battle response
 */
function getMockBattle(code1: string, code2: string, language: string) {
  const winner = code1.length > code2.length ? 1 : 2;
  const loserId = winner === 1 ? 2 : 1;
  return {
    winner,
    roast: `Player ${winner} barely wins, purely because Player ${loserId}'s code is a crime against computer science. Player ${loserId}, your ${language} code looks like it was written by a cat walking across a keyboard.`,
    severityScore: 9
  };
}
