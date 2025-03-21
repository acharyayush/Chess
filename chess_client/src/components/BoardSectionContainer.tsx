import { twMerge } from 'tailwind-merge';

interface BoardSectionContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}
export default function BoardSectionContainer({
  children,
  style,
  className,
}: BoardSectionContainerProps) {
  return (
    <div className={'boardSectionContainer w-full lg:mb-6'}>
      <div
        className={twMerge(
          'boardSection h-full w-full sm:h-[98vh] flex justify-center flex-col mx-auto',
          className
        )}
        style={style}
      >
        {children}
      </div>
    </div>
  );
}
