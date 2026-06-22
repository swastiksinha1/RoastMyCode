import { useMemo } from 'react';

export default function FireParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const size = Math.random() * 6 + 3; // 3px to 9px
      const left = Math.random() * 100; // 0% to 100%
      const duration = Math.random() * 4 + 3; // 3s to 7s
      const delay = Math.random() * 5; // 0s to 5s
      return { id: i, size, left, duration, delay };
    });
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <style>
        {`
          @keyframes fire-rise {
            0% {
              transform: translateY(0) translateX(0) scale(1);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            50% {
              transform: translateY(-50vh) translateX(20px) scale(1.5);
              opacity: 0.8;
            }
            100% {
              transform: translateY(-120vh) translateX(-20px) scale(0);
              opacity: 0;
            }
          }
          
          .fire-particle {
            position: absolute;
            bottom: -20px;
            border-radius: 50%;
            background: rgba(255,165,0,1);
            animation: fire-rise linear infinite;
            filter: blur(2px);
            box-shadow: 0 0 10px rgba(255, 69, 0, 0.8), 0 0 20px rgba(255, 140, 0, 0.4);
          }
        `}
      </style>

      {particles.map((p) => (
        <div
          key={p.id}
          className="fire-particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
