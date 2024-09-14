import React from 'react';
import { twMerge } from 'tailwind-merge';

interface GameDetailContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}
export default function GameDetailContainer({
  children,
  className,
  style,
}: GameDetailContainerProps) {
  return (
    <div
      style={style}
      className={twMerge(
        'text-white gameDetailSection bg-[#465f83c9] shadow-md max-w-[480px] w-[100%] rounded-md flex flex-col lg:flex-col-reverse h-[582px]',
        className
      )}
    >
      {children}
    </div>
  );
}
