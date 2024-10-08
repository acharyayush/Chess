import { Color, PieceSymbol } from 'chess.js';
import { useDispatch } from 'react-redux';
import {
  setPromotion,
  setShowPromotionOption,
} from '../../state/chess/chessSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
interface PromotionOptionsProps {
  player: Color;
}
function PromotionOptions({ player }: PromotionOptionsProps) {
  const { turn } = useSelector((state: RootState) => state.chess);
  const { mainPlayer } = useSelector((state: RootState) => state.players);
  const dispatch = useDispatch();
  const handlePromotionOnClick = (promoteTo: PieceSymbol) => {
    dispatch(setPromotion(promoteTo));
    dispatch(setShowPromotionOption({ canShow: false }));
  };
  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(setShowPromotionOption({ canShow: false }));
  };
  return (
    //height = 290 = (260 + 30), 260/4 for each piece and 30 for cross symbol
    <div
      className={`${turn == mainPlayer ? 'flex-col' : 'flex-col-reverse -translate-y-[var(--yTranslate)]'} flex absolute top-0 left-0 bg-white z-75 shadow-dark-lg`}
    >
      <div
        className='cursor-pointer'
        onClick={(e) => {
          e.stopPropagation();
          handlePromotionOnClick('q');
        }}
      >
        <img
          src={`/pieces/${player}q.svg`}
          className={`${player != mainPlayer && 'rotate-180'}`}
          alt=''
        />
      </div>
      <div
        className='cursor-pointer'
        onClick={(e) => {
          e.stopPropagation();
          handlePromotionOnClick('r');
        }}
      >
        <img
          src={`/pieces/${player}r.svg`}
          className={`${player != mainPlayer && 'rotate-180'}`}
          alt=''
        />
      </div>
      <div
        className='cursor-pointer'
        onClick={(e) => {
          e.stopPropagation();
          handlePromotionOnClick('n');
        }}
      >
        <img
          src={`/pieces/${player}n.svg`}
          className={`${player != mainPlayer && 'rotate-180'}`}
          alt=''
        />
      </div>
      <div
        className='cursor-pointer'
        onClick={(e) => {
          e.stopPropagation();
          handlePromotionOnClick('b');
        }}
      >
        <img
          src={`/pieces/${player}b.svg`}
          className={`${player != mainPlayer && 'rotate-180'}`}
          alt=''
        />
      </div>
      <div
        onClick={handleClose}
        className='h-[30px] bg-gray-300 text-gray-800 grid place-content-center font-bold'
      >
        <span>X</span>
      </div>
    </div>
  );
}

export default PromotionOptions;
