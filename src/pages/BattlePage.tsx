import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Flame, Code2, ChevronDown, Sparkles, Swords, Skull } from 'lucide-react';
import { trpc } from '@/providers/trpc';
import LoadingRoast from '@/components/LoadingRoast';
import Editor from '@monaco-editor/react';
import FireParticles from '@/components/FireParticles';

const LANGUAGES = [
  'Auto Detect', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C++',
  'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'HTML/CSS', 'SQL'
] as const;

export default function BattlePage() {
  const navigate = useNavigate();
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [language, setLanguage] = useState<string>('Auto Detect');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const battleMutation = trpc.roast.battle.useMutation({
    onSuccess: (data) => {
      navigate('/battle/result', {
        state: {
          code1,
          code2,
          winner: data.winner,
          roast: data.roast,
          severityScore: data.severityScore,
          language,
        },
      });
    },
  });

  const handleSubmit = useCallback(() => {
    if (!code1.trim() || !code2.trim()) return;
    battleMutation.mutate({ code1, code2, language });
  }, [code1, code2, language, battleMutation]);

  if (battleMutation.isPending) {
    return <LoadingRoast />;
  }

  return (
    <div className="min-h-screen bg-transparent text-white relative overflow-hidden">
      <FireParticles />
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block">
              Roast<span className="text-orange-500">My</span>Code
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/battle"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 text-sm hover:bg-orange-500/20 transition-colors"
          >
            <Swords className="w-4 h-4" />
            <span className="font-semibold">Battle Mode</span>
          </Link>
          <Link
            to="/hall-of-shame"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-sm hover:bg-neutral-700 transition-colors"
          >
            <Skull className="w-4 h-4" />
            <span className="font-semibold">Hall of Shame</span>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center px-4 py-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
            <Swords className="w-4 h-4" />
            <span>Versus Mode</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            Code <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">Battle</span>
          </h1>
          <p className="text-neutral-400">Two snippets enter. One snippet leaves.</p>
        </div>

        {/* Global Language Selector */}
        <div className="relative mb-6 z-20">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 transition-all text-sm font-medium shadow-lg"
          >
            <Code2 className="w-4 h-4 text-orange-500" />
            <span>Language: {language}</span>
            <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute left-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-neutral-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setIsDropdownOpen(false); }}
                    className={`w-full flex items-center px-4 py-2 text-sm text-left transition-colors ${
                      language === lang ? 'bg-orange-500/10 text-orange-400' : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-8 relative">
          {/* VS Badge */}
          <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-neutral-950 border-4 border-neutral-800 items-center justify-center z-10 shadow-2xl">
            <span className="font-black italic text-xl text-neutral-300">VS</span>
          </div>

          {/* Player 1 */}
          <div className="bg-[#111] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
            <div className="bg-red-950/30 border-b border-red-900/30 px-4 py-3 flex items-center justify-between">
              <span className="font-bold text-red-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Player 1
              </span>
              <span className="text-xs text-neutral-500 font-mono">{code1.length} chars</span>
            </div>
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={language === 'Auto Detect' || language === 'Other' ? 'typescript' : language.toLowerCase()}
                theme="vs-dark"
                value={code1}
                onChange={(v) => setCode1(v || '')}
                options={{ minimap: { enabled: false }, padding: { top: 16 } }}
              />
            </div>
          </div>

          {/* Player 2 */}
          <div className="bg-[#111] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
            <div className="bg-blue-950/30 border-b border-blue-900/30 px-4 py-3 flex items-center justify-between">
              <span className="font-bold text-blue-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Player 2
              </span>
              <span className="text-xs text-neutral-500 font-mono">{code2.length} chars</span>
            </div>
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={language === 'Auto Detect' || language === 'Other' ? 'typescript' : language.toLowerCase()}
                theme="vs-dark"
                value={code2}
                onChange={(v) => setCode2(v || '')}
                options={{ minimap: { enabled: false }, padding: { top: 16 } }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!code1.trim() || !code2.trim() || battleMutation.isPending}
          className={`flex items-center gap-3 px-10 py-4 rounded-full font-black text-lg transition-all ${
            code1.trim() && code2.trim()
              ? 'bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95'
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
          }`}
        >
          <Swords className="w-6 h-6" />
          FIGHT!
        </button>

        {battleMutation.isError && (
          <div className="mt-4 text-red-400 text-sm">Failed to generate battle results. Please try again.</div>
        )}
      </main>
    </div>
  );
}
