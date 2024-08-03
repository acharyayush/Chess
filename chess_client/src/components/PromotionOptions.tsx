import {Color, PieceSymbol, Square } from 'chess.js';
import { useContext, useEffect } from 'react';
import { ChessGameContext } from '../context/ChessGameContext';
import { Cell, updateMoveType } from '../types';
interface PromotionOptionsProps {
  player: Color;
  updateMove: updateMoveType;
  cell: Cell;
  turn: Color;
  position: Square;
}
function PromotionOptions({
  player,
  updateMove,
  cell,
  turn,
  position,
}: PromotionOptionsProps) {
  const {promotion, setPromotion, myPlayer } = useContext(ChessGameContext);
  const handlePromotionOnClick = (promoteTo: PieceSymbol) => {
    setPromotion(promoteTo);
  };
  useEffect(()=>{
     updateMove(cell, turn, position);
  }, [promotion])
  return (
    //height = 290 = (260 + 30), 260/4 for each piece and 30 for cross symbol
    <div className={`${turn==myPlayer ? "flex-col" : "flex-col-reverse -translate-y-[var(--yTranslate)]"} flex w-[var(--cell-size)] h-[calc(var(--cell-size) * 10 + 30px)] absolute top-0 left-0 bg-white z-10 shadow-dark-lg`}>
      <div
        className='cursor-pointer'
        onClick={() => {
          handlePromotionOnClick('q');
        }}
      >
        <img src={`/pieces/${player}q.svg`} alt='' />
      </div>
      <div
        className='cursor-pointer'
        onClick={() => {
          handlePromotionOnClick('r');
        }}
      >
        <img src={`/pieces/${player}r.svg`} alt='' />
      </div>
      <div
        className='cursor-pointer'
        onClick={() => {
          handlePromotionOnClick('n');
        }}
      >
        <img src={`/pieces/${player}n.svg`} alt='' />
      </div>
      <div
        className='cursor-pointer'
        onClick={() => {
          handlePromotionOnClick('b');
        }}
      >
        <img src={`/pieces/${player}b.svg`} alt='' />
      </div>
      <div className='h-[30px] bg-gray-300 text-gray-800 grid place-content-center font-bold'>
        <span>X</span>
      </div>
    </div>
  );
}

export default PromotionOptions;
