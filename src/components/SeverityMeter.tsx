import { useEffect, useState } from 'react';

/**
 * SeverityMeter - Visual gauge showing roast severity (1-10)
 *
 * Props:
 * - score: number (1-10) - The severity score
 */

interface SeverityMeterProps {
  score: number;
}

const SEVERITY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Gentle Warmth', color: '#fbbf24' },
  2: { label: 'Mild Toast', color: '#f59e0b' },
  3: { label: 'Light Sear', color: '#f97316' },
  4: { label: 'Getting Toasty', color: '#ea580c' },
  5: { label: 'Medium Roast', color: '#dc2626' },
  6: { label: 'Well Done', color: '#ef4444' },
  7: { label: 'Burnt Edges', color: '#b91c1c' },
  8: { label: 'Charred', color: '#991b1b' },
  9: { label: 'Incinerated', color: '#7f1d1d' },
  10: { label: 'Nuclear', color: '#450a0a' },
};

function getSeverityInfo(score: number) {
  const clamped = Math.min(10, Math.max(1, Math.round(score)));
  return SEVERITY_LABELS[clamped];
}

export default function SeverityMeter({ score }: SeverityMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const info = getSeverityInfo(score);

  useEffect(() => {
    // Animate the score from 0 to actual value
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const percentage = (animatedScore / 10) * 100;

  // Generate gradient color based on score
  const getBarColor = () => {
    if (score <= 3) return 'from-yellow-400 to-orange-400';
    if (score <= 6) return 'from-orange-400 to-red-500';
    return 'from-red-500 to-red-900';
  };

  return (
    <div className="w-full">
      {/* Score display */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
          Roast Severity
        </span>
        <div className="flex items-center gap-2">
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color: info.color }}
          >
            {animatedScore.toFixed(1)}
          </span>
          <span className="text-sm text-neutral-500">/ 10</span>
        </div>
      </div>

      {/* Bar background */}
      <div className="relative h-3 bg-neutral-800 rounded-full overflow-hidden">
        {/* Animated fill */}
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getBarColor()} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Severity label */}
      <div className="mt-2 text-center">
        <span
          className="text-sm font-medium px-3 py-1 rounded-full inline-block"
          style={{
            backgroundColor: `${info.color}20`,
            color: info.color,
            border: `1px solid ${info.color}40`,
          }}
        >
          {info.label}
        </span>
      </div>

      {/* Flame indicators */}
      <div className="flex justify-center mt-3 gap-1">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-4 rounded-t-full transition-all duration-500 ${
              i < Math.round(animatedScore)
                ? 'bg-gradient-to-t from-orange-600 to-red-500'
                : 'bg-neutral-800'
            }`}
            style={{
              transitionDelay: `${i * 50}ms`,
              opacity: i < Math.round(animatedScore) ? 1 : 0.3,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
