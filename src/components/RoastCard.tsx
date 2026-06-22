import { forwardRef } from 'react';
import { Flame, Lightbulb, AlertTriangle, Quote } from 'lucide-react';
import SeverityMeter from './SeverityMeter';

/**
 * RoastCard - Displays the AI roast and actionable feedback
 *
 * Props:
 * - roast: string - The funny roast text
 * - feedback: string[] - Array of actionable feedback items
 * - severityScore: number (1-10) - How brutal the roast was
 * - language: string - The programming language
 * - codeSnippet: string - The original code (truncated for display)
 */

export interface RoastCardProps {
  roast: string;
  feedback: string[];
  severityScore: number;
  language: string;
  codeSnippet: string;
}

const RoastCard = forwardRef<HTMLDivElement, RoastCardProps>(
  ({ roast, feedback, severityScore, language, codeSnippet }, ref) => {
    // Truncate code for display
    const displayCode =
      codeSnippet.length > 300 ? codeSnippet.slice(0, 300) + '\n// ...' : codeSnippet;

    return (
      <div
        ref={ref}
        className="relative w-full max-w-3xl mx-auto p-6 sm:p-10 bg-[#0a0a0a] overflow-hidden rounded-3xl border border-neutral-800/50"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-neutral-900 to-red-900/20 pointer-events-none" />
        <div className="relative w-full max-w-2xl mx-auto bg-[#111111] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5">
        {/* Card Header - Dark with red accent */}
        <div className="relative bg-gradient-to-r from-neutral-900 via-neutral-900 to-red-950/30 px-6 py-5 border-b border-neutral-800">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-500 via-red-500 to-orange-500" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-900/30">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">
                  Roast Report
                </h3>
                <p className="text-neutral-500 text-xs">
                  Language: <span className="text-orange-400 font-mono">{language}</span>
                </p>
              </div>
            </div>

            {/* Severity badge */}
            <div
              className="px-3 py-1.5 rounded-lg text-sm font-bold"
              style={{
                background: `linear-gradient(135deg, rgba(239,68,68,0.2), rgba(249,115,22,0.2))`,
                color: severityScore >= 7 ? '#ef4444' : severityScore >= 4 ? '#f97316' : '#fbbf24',
                border: `1px solid ${severityScore >= 7 ? 'rgba(239,68,68,0.3)' : severityScore >= 4 ? 'rgba(249,115,22,0.3)' : 'rgba(251,191,36,0.3)'}`,
              }}
            >
              {severityScore}/10
            </div>
          </div>
        </div>

        {/* Code snippet preview */}
        <div className="px-6 pt-4">
          <div className="bg-[#0a0a0a] rounded-lg border border-neutral-800/80 overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900/80 border-b border-neutral-800/80">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="ml-2 text-[10px] text-neutral-600 font-mono">your_code.{getFileExtension(language)}</span>
            </div>
            <pre className="px-4 py-3 text-xs text-neutral-500 font-mono overflow-x-auto leading-relaxed">
              <code>{displayCode}</code>
            </pre>
          </div>
        </div>

        {/* The Roast */}
        <div className="px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Quote className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-red-400 font-semibold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                The Roast
              </h4>
              <p className="text-neutral-200 text-base leading-relaxed italic">
                &ldquo;{roast}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Severity Meter */}
        <div className="px-6 pb-5">
          <SeverityMeter score={severityScore} />
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />

        {/* Actionable Feedback */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-green-400 font-semibold text-sm uppercase tracking-wider">
              But Seriously...
            </h4>
          </div>

          <ul className="space-y-3">
            {feedback.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-green-950/20 border border-green-900/30"
                style={{
                  animation: `slideInLeft 0.4s ease-out ${index * 0.1}s both`,
                }}
              >
                <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-neutral-300 text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 bg-neutral-900/50 border-t border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-neutral-600 text-xs">
              RoastMyCode
            </span>
          </div>
          <span className="text-neutral-700 text-xs font-mono">
            {new Date().toLocaleDateString()}
          </span>
        </div>

        <style>{`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
        </div>
      </div>
    );
  }
);

RoastCard.displayName = 'RoastCard';

/**
 * Get file extension based on language
 */
function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    JavaScript: 'js',
    Python: 'py',
    Java: 'java',
    'C++': 'cpp',
    TypeScript: 'ts',
    Other: 'txt',
  };
  return extensions[language] || 'txt';
}

export default RoastCard;
