import { Color } from 'chess.js';
import { MdTimer } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
interface TimeProps {
  color: Color;
  turn: Color;
  timeLeft?: number;
  className?: string;
}
export default function Timer({
  color,
  turn,
  timeLeft = 15 * 60,
  className,
}: TimeProps) {
  const displayTime = (timeInSec: number) => {
    const min = Math.floor(timeInSec / 60);
    const sec = timeInSec % 60;
    const minutes: string = min < 10 ? `0${min}` : `${min}`;
    const seconds: string = sec < 10 ? `0${sec}` : `${sec}`;
    return (
      <>
        {minutes}:{seconds}
      </>
    );
  };
  return (
    <div
      className={twMerge(
        `w-32 rounded-md flex justify-between px-4 items-center text-xl ${color === turn ? 'bg-blue-500 ' : 'bg-slate-600'}`,
        className
      )}
    >
      <span id='timer'>
        <MdTimer />
      </span>
      <div className='time ml-1 font-mono text-2xl'>
        {displayTime(timeLeft)}
      </div>
    </div>
  );
}
