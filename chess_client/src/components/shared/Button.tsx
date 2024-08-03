import { twMerge } from "tailwind-merge";
import { Link } from "react-router-dom";
interface ButtonProps{
    children: React.ReactNode,
    className?: string,
    navigateTo?: string,
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement> | undefined,
    noShadow?: boolean
}
export default function Button({children, onClick, className, navigateTo, noShadow}: ButtonProps) {
  if (!navigateTo){
    return <button style={!noShadow ? {boxShadow: "0 0.4rem 0.1rem rgba(0, 18, 47, 0.5)"} : {}} onClick={onClick} className={twMerge(`inline-block bg-blue-500 py-4 px-16 rounded-xl text-3xl font-bold text-white m-2`, className)}>
    {children}
  </button>;
  }
  return <Link style={!noShadow ? {boxShadow: "0 0.4rem 0.1rem rgba(0, 18, 47, 0.5)"} : {}} to={navigateTo} onClick={onClick} className={twMerge(`inline-block bg-blue-500 py-4 px-16 rounded-xl text-3xl font-bold text-white m-2`, className)}>
    {children}
  </Link>;
}
