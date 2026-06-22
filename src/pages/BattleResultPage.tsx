import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, ArrowLeft, Trophy, Skull } from 'lucide-react';
import FireParticles from '@/components/FireParticles';
import { useTypewriter } from '@/hooks/useTypewriter';

interface BattleState {
  code1: string;
  code2: string;
  winner: number;
  roast: string;
  severityScore: number;
  language: string;
}

export default function BattleResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as BattleState | null;

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Battle Data Found</h1>
          <button onClick={() => navigate('/battle')} className="px-4 py-2 bg-neutral-800 rounded-lg">Go to Battle Arena</button>
        </div>
      </div>
    );
  }

  const { winner, roast, severityScore } = state;
  const loser = winner === 1 ? 2 : 1;
  const { displayedText, isTyping } = useTypewriter(roast, 25);

  return (
    <div className="min-h-screen bg-transparent text-white relative overflow-hidden flex flex-col items-center justify-center p-4">
      <FireParticles />
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 ${winner === 1 ? 'left-0' : 'right-0'} w-[800px] h-[800px] bg-green-600/5 rounded-full blur-[150px]`} />
        <div className={`absolute bottom-0 ${loser === 1 ? 'left-0' : 'right-0'} w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[150px]`} />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold mb-6">
            <Trophy className="w-5 h-5" />
            <span>PLAYER {winner} WINS</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
            FATALITY.
          </h1>
          <p className="text-neutral-400 text-lg">Player {loser}'s code was completely obliterated.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="bg-[#111] border border-red-900/50 rounded-3xl p-8 md:p-12 shadow-[0_0_100px_rgba(220,38,38,0.15)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex items-center gap-3 mb-6">
            <Skull className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-red-500 uppercase tracking-widest">Judgment for Player {loser}</h2>
          </div>

          <p className="text-2xl md:text-3xl font-medium leading-relaxed text-neutral-200 mb-8 min-h-[120px]">
            "{displayedText}"
            {isTyping && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-3 h-8 ml-2 align-middle bg-red-500" />}
          </p>

          <div className="flex items-center justify-between border-t border-neutral-800 pt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-neutral-500 uppercase tracking-widest">Loser Severity</span>
              <div className="flex items-center gap-1">
                <span className="text-3xl font-black text-white">{severityScore}</span>
                <span className="text-neutral-500 font-bold">/10</span>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/battle')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors"
            >
              <Swords className="w-4 h-4" />
              Rematch
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
