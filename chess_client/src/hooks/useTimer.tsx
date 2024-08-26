import { useEffect, useRef, useState } from 'react';

export default function useTimer(totalTime: number) {
  const [time, setTime] = useState(totalTime);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const startTimer = () => {
    if (timer.current) return;
    timer.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) return prevTime - 1;
        if (timer.current) clearInterval(timer.current);
        return 0;
      });
    }, 1000);
  };
  const pauseTimer = () => {
    if (!timer.current) return;
    clearInterval(timer.current);
    timer.current = null;
  };
  const resetTimer = () => {
    pauseTimer();
    setTime(totalTime);
  };
  useEffect(() => {
    return () => {
      pauseTimer();
    };
  }, []);
  return { time, startTimer, pauseTimer, resetTimer };
}
