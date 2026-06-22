import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Flame, Code2, ChevronDown, Sparkles, Terminal, Zap, Github, Skull, UserSquare2 } from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { toast } from "sonner";
import LoadingRoast from '@/components/LoadingRoast';
import Editor from '@monaco-editor/react';

const PERSONALITIES = [
  'Senior Dev',
  'Angry Tech Lead',
  'Gen-Z Intern',
  'Gordon Ramsay',
] as const;

/**
 * HomePage - Landing page for RoastMyCode
 *
 * Features:
 * - Large code input textarea with syntax-friendly styling
 * - Language selector dropdown
 * - Submit button that calls the roast API
 * - Loading state with funny messages
 */

const LANGUAGES = [
  'Auto Detect',
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'Ruby',
  'PHP',
  'Swift',
  'Kotlin',
  'HTML/CSS',
  'SQL',
  'Other',
] as const;

const FUNNY_PLACEHOLDERS = [
  '// Paste your questionable code here...\n// Don\'t worry, we\'ve seen worse... probably.',
  '// Drop your code here and prepare for judgment\nfunction yourCode() { \n  // TODO: write decent code\n}',
  '// Enter the code you want roasted\n// Warning: our AI has opinions',
  '// Paste code, receive roast\n// It\'s like therapy but cheaper',
];

import { motion, AnimatePresence } from 'framer-motion';
import FireParticles from '@/components/FireParticles';

export default function HomePage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<string>('Auto Detect');
  const [personality, setPersonality] = useState<string>('Senior Dev');
  const [githubUrl, setGithubUrl] = useState('');
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPersonalityDropdownOpen, setIsPersonalityDropdownOpen] = useState(false);

  // tRPC mutation for roasting
  const roastMutation = trpc.roast.generate.useMutation({
    onSuccess: (data) => {
      // Navigate to roast page with results in state
      navigate('/roast', {
        state: {
          roast: data.roast,
          feedback: data.feedback,
          severityScore: data.severityScore,
          language,
          code,
        },
      });
    },
  });

  const handleGithubFetch = async () => {
    if (!githubUrl.trim()) return;
    try {
      setIsFetchingGithub(true);
      let rawUrl = githubUrl.trim();
      
      if (rawUrl.includes('github.com') && !rawUrl.includes('/blob/') && !rawUrl.startsWith('https://raw.githubusercontent.com')) {
        toast.info("That looks like a repository link!", {
          description: "Please navigate to the specific file containing the source code you want to roast, and paste that URL instead.",
          duration: 5000,
        });
        setIsFetchingGithub(false);
        return;
      }

      if (rawUrl.startsWith('https://raw.githubusercontent.com')) {
        // Already a raw URL, keep as is
      } else if (rawUrl.includes('github.com') && rawUrl.includes('/blob/')) {
        try {
          const urlObj = new URL(rawUrl);
          urlObj.hostname = 'raw.githubusercontent.com';
          urlObj.pathname = urlObj.pathname.replace('/blob/', '/');
          rawUrl = urlObj.toString();
        } catch (e) {
          // If URL parsing fails, fallback to simple string replacement
          rawUrl = rawUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        }
      }
      const res = await fetch(rawUrl);
      if (!res.ok) throw new Error('Failed to fetch');
      const text = await res.text();
      setCode(text);
      setGithubUrl('');
    } catch (e) {
      alert("Failed to fetch code from GitHub. Make sure it's a public file.");
    } finally {
      setIsFetchingGithub(false);
    }
  };

  const handleSubmit = useCallback(() => {
    if (!code.trim()) return;
    roastMutation.mutate({ code, language, personality });
  }, [code, language, personality, roastMutation]);

  // Random placeholder
  const placeholder = FUNNY_PLACEHOLDERS[Math.floor(Math.random() * FUNNY_PLACEHOLDERS.length)];

  // Show loading screen while roasting
  if (roastMutation.isPending) {
    return <LoadingRoast />;
  }

  return (
    <div className="min-h-screen bg-transparent text-white relative overflow-hidden">
      {/* Background effects */}
      <FireParticles />
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-orange-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[120px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Roast<span className="text-orange-500">My</span>Code
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/hall-of-shame"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-all hover:scale-105"
          >
            <Skull className="w-4 h-4" />
            <span className="font-semibold">Hall of Shame</span>
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-white transition-colors text-sm hover:scale-105"
          >
            GitHub
          </a>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        {/* Hero text */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="text-center mb-10 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm mb-6 hover:bg-orange-500/20 transition-colors cursor-default">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Code Roasts</span>
          </div>

          <motion.h1 
            key={personality}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
          >
            Let {personality === 'Gordon Ramsay' ? '' : 'a '}{' '}
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
              {personality}
            </span>{' '}
            Roast Your Code
          </motion.h1>

          <p className="text-neutral-400 text-lg max-w-lg mx-auto leading-relaxed">
            Paste your code, pick your language, and brace yourself.
            <br />
            Brutally honest feedback with real actionable tips.
          </p>
        </motion.div>

        {/* Code Input Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
          className="w-full max-w-3xl"
        >
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 transition-all duration-300 hover:border-neutral-700/80 hover:shadow-[0_0_40px_rgba(234,88,12,0.1)]">
            {/* Card Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-900/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 group">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 group-hover:bg-red-500 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80 group-hover:bg-yellow-500 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80 group-hover:bg-green-500 transition-colors" />
                </div>
                <div className="w-px h-4 bg-neutral-700 mx-1" />
                <Terminal className="w-4 h-4 text-neutral-500" />
                <span className="text-xs text-neutral-500 font-mono">your_code.txt</span>
              </div>

              {/* Selectors */}
              <div className="flex items-center gap-2">
                {/* Personality Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsPersonalityDropdownOpen(!isPersonalityDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700/50 text-sm text-neutral-300 hover:bg-neutral-700 hover:border-neutral-600 transition-all active:scale-95"
                  >
                    <UserSquare2 className="w-4 h-4 text-neutral-500" />
                    <span>{personality}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${
                        isPersonalityDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isPersonalityDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsPersonalityDropdownOpen(false)}
                        />
                        <motion.div 
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-1.5 w-56 bg-[#1a1a1a] border border-neutral-700 rounded-xl shadow-2xl z-50 overflow-hidden origin-top-right"
                        >
                          {PERSONALITIES.map((p) => (
                            <button
                              key={p}
                              onClick={() => {
                                setPersonality(p);
                                setIsPersonalityDropdownOpen(false);
                              }}
                              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                                personality === p
                                  ? 'bg-orange-500/10 text-orange-400'
                                  : 'text-neutral-300 hover:bg-neutral-800'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                  personality === p ? 'bg-orange-500' : 'bg-neutral-600'
                                }`}
                              />
                              {p}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Language Selector */}
                <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700/50 text-sm text-neutral-300 hover:bg-neutral-700 hover:border-neutral-600 transition-all active:scale-95"
                >
                  <Code2 className="w-4 h-4 text-neutral-500" />
                  <span>{language}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <motion.div 
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-1.5 w-48 bg-[#1a1a1a] border border-neutral-700 rounded-xl shadow-2xl z-50 overflow-hidden origin-top-right max-h-64 overflow-y-auto custom-scrollbar"
                      >
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang}
                            onClick={() => {
                              setLanguage(lang);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                              language === lang
                                ? 'bg-orange-500/10 text-orange-400'
                                : 'text-neutral-300 hover:bg-neutral-800'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                language === lang ? 'bg-orange-500' : 'bg-neutral-600'
                              }`}
                            />
                            {lang}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

            {/* GitHub Fetch Input */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-neutral-800 bg-neutral-900/30 group transition-colors focus-within:bg-neutral-900/50">
              <Github className="w-5 h-5 text-neutral-500 group-focus-within:text-neutral-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Paste a public GitHub file URL to auto-fetch code..." 
                className="flex-1 bg-transparent border-none outline-none text-sm text-neutral-300 placeholder:text-neutral-600 transition-all focus:placeholder:opacity-50"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGithubFetch()}
              />
              <button 
                onClick={handleGithubFetch}
                disabled={isFetchingGithub || !githubUrl}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                {isFetchingGithub ? 'Fetching...' : 'Fetch Code'}
              </button>
            </div>

            {/* Editor Container */}
            <div className="relative border-b border-neutral-800">
              <Editor
                height="400px"
                language={language === 'Auto Detect' || language === 'Other' ? 'typescript' : language.toLowerCase()}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: 'monospace',
                  padding: { top: 20 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                }}
              />
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-800 bg-neutral-900/30">
              <div className="flex items-center gap-4 text-xs text-neutral-600">
                <span className="flex items-center gap-1 transition-colors hover:text-orange-500">
                  <Zap className="w-3 h-3" />
                  {code.length.toLocaleString()} chars
                </span>
                <span className="transition-colors hover:text-orange-500">{code.split('\n').length} lines</span>
              </div>

              <motion.button
                whileHover={code.trim() ? { scale: 1.05 } : {}}
                whileTap={code.trim() ? { scale: 0.95 } : {}}
                onClick={handleSubmit}
                disabled={!code.trim() || roastMutation.isPending}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  code.trim()
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-900/30 hover:shadow-orange-900/50'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
              >
                <Flame className="w-4 h-4" />
                Roast My Code
              </motion.button>
            </div>
          </div>

          {/* Error message */}
          {roastMutation.isError && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-red-950/30 border border-red-900/50 text-red-400 text-sm text-center"
            >
              <p className="font-bold mb-1">Oops! Something went wrong.</p>
              <p className="opacity-80 font-mono text-xs">{roastMutation.error?.message || "Unknown error occurred"}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
          {[
            {
              icon: Flame,
              title: 'Brutal Roasts',
              desc: 'Hilarious, savage feedback that roasts your code, not you.',
              color: 'text-orange-400',
              bg: 'bg-orange-500/10',
            },
            {
              icon: Sparkles,
              title: 'Real Feedback',
              desc: 'Actionable tips to improve your code quality and practices.',
              color: 'text-green-400',
              bg: 'bg-green-500/10',
            },
            {
              icon: Terminal,
              title: 'Share Results',
              desc: 'Download your roast card as an image to share with friends.',
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="flex flex-col items-center text-center p-5 rounded-xl bg-neutral-900/40 border border-neutral-800/50 hover:border-neutral-700/80 hover:bg-neutral-800/40 transition-all duration-300 shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-default"
            >
              <div className={`w-10 h-10 rounded-lg ${feature.bg} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-neutral-500 text-xs leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

      </main>
    </div>
  );
}
