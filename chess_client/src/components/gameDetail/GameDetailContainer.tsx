import { twMerge } from 'tailwind-merge';

interface GameDetailContainerProps {
  children: React.ReactNode;
  className?: string;
}
export default function GameDetailContainer({
  children,
  className,
}: GameDetailContainerProps) {
  return (
    <div
      className={twMerge(
        'text-white gameDetailSection bg-[#465f83c9] shadow-md max-w-[480px] w-[100%] rounded-md lg:flex lg:flex-col-reverse',
        className
      )}
    >
      {children}
    </div>
  );
}
