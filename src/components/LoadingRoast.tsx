import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

/**
 * LoadingRoast - Animated loading screen with funny messages
 * Shown while the AI is "judging" the code
 */

const LOADING_MESSAGES = [
  "Untangling your spaghetti code...",
  "Finding out what 'temp123' actually does...",
  "Questioning your career choices...",
  "Consulting the ancient coding scrolls...",
  "Preparing the roast... medium rare?",
  "Calculating technical debt interest...",
  "Searching for tests... any tests...",
];

export default function LoadingRoast() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a]">
      {/* Animated flame background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Flame icon with animation */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl animate-ping" style={{ animationDuration: '2s' }} />
        <Flame className="relative w-20 h-20 text-orange-500 animate-bounce" style={{ animationDuration: '1.5s' }} />
      </div>

      {/* Title */}
      <h2 className="relative text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
        Roasting Your Code
        <span className="inline-flex ml-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce mx-0.5" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce mx-0.5" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce mx-0.5" style={{ animationDelay: '300ms' }} />
        </span>
      </h2>

      {/* Rotating funny message */}
      <div className="relative h-8 flex items-center justify-center">
        <p
          key={messageIndex}
          className="text-lg text-neutral-400 animate-fade-in-up text-center px-4"
          style={{
            animation: 'fadeInUp 0.5s ease-out',
          }}
        >
          {LOADING_MESSAGES[messageIndex]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative mt-10 w-64 h-1 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 rounded-full"
          style={{
            animation: 'loadingBar 2s ease-in-out infinite',
            width: '100%',
          }}
        />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes loadingBar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
