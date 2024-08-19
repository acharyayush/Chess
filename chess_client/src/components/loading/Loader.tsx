import { twMerge } from 'tailwind-merge';
import './Loader.css';
interface LoaderProps {
  className?: string;
}
export default function Loader({ className }: LoaderProps) {
  return (
    <div className={twMerge('loader', className)}>
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={index}
          className={`ball`}
          style={{ '--i': index + 1 } as React.CSSProperties}
        ></div>
      ))}
    </div>
  );
}
