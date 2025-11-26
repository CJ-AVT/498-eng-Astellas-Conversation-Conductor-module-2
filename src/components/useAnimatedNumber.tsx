import { useState, useEffect } from 'react';

export const useAnimatedNumber = (target: number) => {
  const [current, setCurrent] = useState(target);

  useEffect(() => {
    const difference = target - current;
    if (difference === 0) return;

    const step = Math.sign(difference) * Math.max(1, Math.abs(difference) * 0.1);
    const timeout = setTimeout(() => {
      setCurrent(prev => Math.abs(target - prev) < Math.abs(step) ? target : prev + step);
    }, 16);

    return () => clearTimeout(timeout);
  }, [current, target]);

  return Math.round(current);
};