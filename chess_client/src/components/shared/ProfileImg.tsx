import { Color } from 'chess.js';
import { twMerge } from 'tailwind-merge';

interface ProfileImgProps {
  ringColorClass?: string | null;
  className?: string;
  color?: Color;
  logoUrl?: string;
}
function ProfileImg({
  ringColorClass,
  logoUrl,
  className,
  color,
}: ProfileImgProps) {
  return (
    <div
      className={twMerge(
        `bg-slate-200 rounded-md ${ringColorClass && `ring-4 ${ringColorClass}`} w-[50px] flex justify-center items-center p-1`,
        className
      )}
    >
      <img
        src={logoUrl ? logoUrl : `/pieces/${color || 'w'}p.svg`}
        alt=''
        className={`${logoUrl ? 'w-full' : 'w-[90%]'} rounded-md`}
      />
    </div>
  );
}

export default ProfileImg;
