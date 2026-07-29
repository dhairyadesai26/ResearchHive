import { useState, useEffect, useCallback } from 'react';

export function useTypewriter(text, options = {}) {
  const {
    speed = 50,
    delay = 0,
    startOnMount = true,
  } = options;

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const start = useCallback(() => {
    setDisplayedText('');
    setIsTyping(true);
    setIsComplete(false);

    let currentIndex = 0;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, speed, delay]);

  useEffect(() => {
    if (startOnMount) {
      const cleanup = start();
      return cleanup;
    }
  }, [startOnMount, start]);

  return { displayedText, isTyping, isComplete, start };
}
