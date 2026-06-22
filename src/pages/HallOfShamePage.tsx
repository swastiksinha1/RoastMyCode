import { Link } from 'react-router-dom';
import { Flame, ArrowLeft, Skull } from 'lucide-react';
import { trpc } from '@/providers/trpc';

export default function HallOfShamePage() {
  const { data: roasts, isLoading } = trpc.roast.getRecent.useQuery();

  return (
    <div className="min-h-screen bg-transparent text-white relative overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-neutral-500 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Roaster</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center">
            <Skull className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Hall of <span className="text-red-500">Shame</span>
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center px-4 py-12 md:py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            The Worst Code on the <span className="text-red-500">Internet</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-lg mx-auto">
            A gallery of the most atrocious, eye-bleeding code snippets ever submitted. Viewer discretion is advised.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Flame className="w-10 h-10 text-orange-500 animate-bounce" />
          </div>
        ) : roasts && roasts.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 w-full space-y-6">
            {roasts.map((roast) => (
              <div key={roast.id} className="break-inside-avoid bg-[#111111] border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-red-500/30 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[50px] group-hover:bg-red-500/10 transition-all" />
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-neutral-800 px-2 py-1 rounded text-neutral-400">
                      {roast.language}
                    </span>
                    <span className="text-xs text-neutral-600">
                      via {roast.personality}
                    </span>
                  </div>
                  <div className={`text-xl font-black italic tracking-tighter ${roast.severityScore > 7 ? 'text-red-500' : roast.severityScore > 4 ? 'text-orange-500' : 'text-yellow-500'}`}>
                    {roast.severityScore}/10
                  </div>
                </div>

                <div className="mb-4 bg-black/50 p-4 rounded-xl border border-neutral-800/50">
                  <pre className="text-xs text-neutral-300 font-mono overflow-hidden" style={{ maxHeight: '150px' }}>
                    {roast.codeSnippet.length > 300 ? roast.codeSnippet.substring(0, 300) + '...' : roast.codeSnippet}
                  </pre>
                </div>

                <div className="relative z-10">
                  <p className="text-sm text-neutral-300 leading-relaxed italic">
                    "{roast.roastText}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-neutral-500">
            <Skull className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No code terrible enough to display yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
