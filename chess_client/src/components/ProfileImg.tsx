import { Color } from "chess.js"
import { twMerge } from "tailwind-merge"

interface ProfileImgProps{
    ringColorClass?: string | null,
    className?: string,
    color?:Color
}
function ProfileImg({ringColorClass, className, color}:ProfileImgProps) {
  return (
    <div className={twMerge(`bg-slate-200 rounded-md ${ringColorClass && `ring-4 ${ringColorClass}`} w-[50px] flex justify-center items-center`, className)}>
    <img src={`/pieces/${color || "w"}p.svg`} alt="" className="w-[90%]"/>
    </div>
  )
}

export default ProfileImg