import { twMerge } from 'tailwind-merge';

interface CardProps {
  imgUrl: string;
  title?: string;
  textOnImg?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}
export default function Card({
  imgUrl,
  title,
  textOnImg,
  className,
  onClick,
}: CardProps) {
  return (
    <div className={twMerge('Card w-[250px] sm:w-[150px]', className)}>
      <div
        onClick={onClick}
        className='Image group relative w-full rounded-lg cursor-pointer p-6'
      >
        <img
          src={imgUrl}
          alt='Card Image'
          className='rounded-lg w-full'
        />
        {textOnImg && (
          <>
            <div className='overlay hidden group-hover:block absolute top-0 left-0 bottom-0 right-0 bg-gray-700/50 rounded-lg'></div>
            <div className='Name hidden group-hover:block absolute text-5xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-white tracking-wider select-none'>
              {textOnImg}
            </div>
          </>
        )}
      </div>
      {title && (
        <div
          style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
          className='text-3xl lg:text-xl font-bold leading-[60px] mb-8 text-white text-center select-none'
        >
          {title}
        </div>
      )}
    </div>
  );
}
