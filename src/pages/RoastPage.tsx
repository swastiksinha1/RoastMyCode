import { useRef, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Flame, Download, ArrowLeft, Copy, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import RoastCard from '@/components/RoastCard';
import type { RoastCardProps } from '@/components/RoastCard';
import FireParticles from '@/components/FireParticles';

/**
 * RoastPage - Displays the roast results
 *
 * Features:
 * - Shows the RoastCard with severity meter
 * - Download card as image (html2canvas)
 * - Share via copy link
 * - Navigate back to roast again
 */

interface RoastState {
  roast: string;
  feedback: string[];
  severityScore: number;
  language: string;
  code: string;
}

export default function RoastPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get roast data from navigation state
  const state = location.state as RoastState | null;

  // Handle missing state (direct navigation to /roast)
  if (!state) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center relative">
        <FireParticles />
        <div className="text-center relative z-10">
          <Flame className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">No Roast Found</h1>
          <p className="text-neutral-500 mb-6">
            You need to submit code first to get roasted.
          </p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold text-sm hover:from-orange-500 hover:to-red-500 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { roast, feedback, severityScore, language, code } = state;

  // Download card as image
  const handleDownload = useCallback(async () => {
    if (!cardRef.current || isCapturing) return;

    setIsCapturing(true);
    toast.loading('Generating roast card image...', { id: 'download' });

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2, // High resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Convert to blob and download
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png', 1.0);
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `roast-my-code-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Roast card downloaded!', { id: 'download' });
    } catch (error) {
      console.error('Failed to generate image:', error);
      toast.error('Failed to generate image. Try again.', { id: 'download' });
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing]);

  // Copy share link
  const handleShare = useCallback(async () => {
    try {
      // Copy the current URL to clipboard
      await navigator.clipboard.writeText(window.location.origin);

      setCopied(true);
      toast.success('Link copied to clipboard!');

      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  }, []);

  // Go back to roast more code
  const handleRoastAgain = useCallback(() => {
    navigate('/', { state: { preserveCode: true, code, language } });
  }, [navigate, code, language]);

  const cardProps: RoastCardProps = {
    roast,
    feedback,
    severityScore,
    language,
    codeSnippet: code,
  };

  return (
    <div className="min-h-screen bg-transparent text-white relative overflow-hidden">
      {/* Background effects */}
      <FireParticles />
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-orange-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4">
        <button
          onClick={handleRoastAgain}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold tracking-tight">
            Roast<span className="text-orange-500">My</span>Code
          </span>
        </div>

        <div className="w-16" /> {/* Spacer for centering */}
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-4 py-8 md:py-12">
        {/* Page Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs mb-3">
            <Flame className="w-3 h-3" />
            <span>Verdict Delivered</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Your Code Has Been{' '}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Judged
            </span>
          </h1>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto mb-8"
        >
          <button
            onClick={handleDownload}
            disabled={isCapturing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/50 text-neutral-200 text-sm font-medium hover:bg-neutral-800 hover:border-neutral-600 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isCapturing ? 'Generating...' : 'Download Card'}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/50 text-neutral-200 text-sm font-medium hover:bg-neutral-800 hover:border-neutral-600 transition-all"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>

          <button
            onClick={handleRoastAgain}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white text-sm font-semibold hover:from-orange-500 hover:to-red-500 transition-all shadow-lg shadow-orange-900/20"
          >
            <Flame className="w-4 h-4" />
            Roast Again
          </button>
        </motion.div>

        {/* Roast Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, type: "spring", bounce: 0.4 }}
          className="mb-8"
        >
          <RoastCard ref={cardRef} {...cardProps} />
        </motion.div>

        {/* Severity legend */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/50">
            <h3 className="text-sm font-semibold text-neutral-400 mb-3 uppercase tracking-wider">
              Severity Scale
            </h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {[
                { score: 1, label: 'Warmth', color: 'from-yellow-600 to-yellow-500' },
                { score: 2, label: 'Toast', color: 'from-yellow-500 to-orange-500' },
                { score: 3, label: 'Sear', color: 'from-orange-600 to-orange-500' },
                { score: 4, label: 'Toasty', color: 'from-orange-500 to-orange-400' },
                { score: 5, label: 'Medium', color: 'from-orange-400 to-red-500' },
                { score: 6, label: 'Well Done', color: 'from-red-500 to-red-600' },
                { score: 7, label: 'Burnt', color: 'from-red-600 to-red-700' },
                { score: 8, label: 'Charred', color: 'from-red-700 to-red-800' },
                { score: 9, label: 'Nuclear', color: 'from-red-800 to-red-900' },
                { score: 10, label: 'Apocalypse', color: 'from-red-900 to-red-950' },
              ].map((item) => (
                <div
                  key={item.score}
                  className={`text-center p-2 rounded-lg transition-all duration-500 ${
                    severityScore >= item.score
                      ? 'bg-neutral-800 ring-1 ring-orange-500/50 scale-105'
                      : 'opacity-40'
                  }`}
                >
                  <div
                    className={`w-full h-2 rounded-full bg-gradient-to-r ${item.color} mb-1 ${
                      severityScore >= item.score ? 'opacity-100' : 'opacity-20'
                    }`}
                  />
                  <span className="text-[10px] text-neutral-500">{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
