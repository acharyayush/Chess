import ProfileImg from './ProfileImg';
import Button from './shared/Button';
import { twMerge } from 'tailwind-merge';
import { useSelector, useDispatch } from 'react-redux';
import { setRematch } from '../state/gameStatus/gameStatusSlice'; 
import { RootState } from '../state/store';
interface GameOverPopUp {
  className?: string;
}
function GameOverPopUp({
  className,
}: GameOverPopUp) {
  const {winner, gameOverDescription, isDraw} = useSelector((state:RootState)=>state.gameStatus)
  const dispatch = useDispatch();
  const getHeading = () => {
    let heading: string;
    if (isDraw) {
      heading = 'Draw';
    } else {
      heading = winner == 'w' ? 'Player 1 Won' : 'Player 2 Won';
    }
    return heading;
  };
  return (
    <div
      className={twMerge(
        `bg-zinc-900 text-white text-center py-5 rounded-lg shadow-lg w-[300px] z-50`,
        className
      )}
    >
      <h1 className='text-center text-2xl font-bold'>{getHeading()}</h1>
      <h2 className='text-center text-md font-bold'>by {gameOverDescription}</h2>
      <div className='flex justify-between my-8  px-9'>
        <div className='flex flex-col font-bold'>
          <ProfileImg
            ringColorClass={`${winner == 'w' ? 'ring-blue-500' : 'ring-white'}`}
            className='w-[70px]'
          />
          <span className='mt-1'>Player 1</span>
        </div>
        <span className='text-2xl mt-auto mb-6'>vs</span>
        <div className='flex flex-col font-bold'>
          <ProfileImg
            ringColorClass={`${winner == 'b' ? 'ring-blue-500' : 'ring-white'}`}
            className='w-[70px]'
          />
          <span className='mt-1'>Player 2</span>
        </div>
      </div>
      <Button onClick={()=>dispatch(setRematch(true))}>Rematch</Button>
    </div>
  );
}

export default GameOverPopUp;
