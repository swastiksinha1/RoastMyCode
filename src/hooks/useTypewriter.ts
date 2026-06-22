import { useState, useEffect } from 'react';

export function useTypewriter(text: string, speed: number = 20) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;

    // Small delay before starting
    const timeout = setTimeout(() => {
      const intervalId = setInterval(() => {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
        
        if (i === text.length) {
          clearInterval(intervalId);
          setIsTyping(false);
        }
      }, speed);

      return () => clearInterval(intervalId);
    }, 500);

    return () => clearTimeout(timeout);
  }, [text, speed]);

  return { displayedText, isTyping };
}
