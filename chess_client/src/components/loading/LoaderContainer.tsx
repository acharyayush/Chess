import { twMerge } from 'tailwind-merge';

interface LoaderContainerProps {
  className?: string;
  children: JSX.Element;
}
export default function LoaderContainer({
  className,
  children,
}: LoaderContainerProps) {
  return (
    <div className={twMerge('loaderContainer', className)}>{children}</div>
  );
}
