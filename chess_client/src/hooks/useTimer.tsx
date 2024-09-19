import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';

export default function useTimer() {
  const { totalTime } = useSelector((state: RootState) => state.players);
  const [time, setTime] = useState(totalTime);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const startTimer = (time?: number) => {
    if (time) setTime(time);
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
  const resetTimer = (totalTime: number) => {
    pauseTimer();
    setTime(totalTime);
  };
  useEffect(() => {
    if (!timer.current) {
      setTime(totalTime);
      return;
    }
    resetTimer(totalTime);
    startTimer();
  }, [totalTime]);
  useEffect(() => {
    return () => {
      pauseTimer();
    };
  }, []);
  return { time, startTimer, pauseTimer, resetTimer };
}
