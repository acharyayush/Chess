import { Color, KING, PieceSymbol, Square } from 'chess.js';
import { CommonCellAndChessProps } from '../types';
import PromotionOptions from './PromotionOptions';
import { useContext, useState } from 'react';
import { ChessGameContext } from '../context/ChessGameContext';
import { twMerge } from 'tailwind-merge';

interface CellProps extends CommonCellAndChessProps {
  cell: {
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null;
  cellColor: string;
  position: Square;
  isDisable: boolean;
}
export default function Cell({
  cell,
  cellColor,
  position,
  activeSquare,
  turn,
  inCheck,
  updateMove,
  isDisable,
}: CellProps) {
  const {
    showPromotionOption,
    legalMoves,
    showLegalMoves,
    isDragging,
    setIsDragging,
  } = useContext(ChessGameContext);
  const [pieceImg, setPieceImg] = useState<HTMLImageElement>()
  const [startPos, setStartPos] = useState({x:0, y:0})
  const stylesforCell = () => {
    let classes = cellColor;

    if (cell) {
      classes = twMerge(classes, 'cursor-pointer');
    }
    if (inCheck && turn == cell?.color && cell?.type == KING) {
      classes = twMerge(classes, '!bg-red-300');
    }
    if (activeSquare === position) {
      classes = twMerge(classes, '!bg-blue-300');
    }
    if(position=="a1"){
      classes = twMerge(classes, 'rounded-bl-md');
    }
    if(position=="a8"){
      classes = twMerge(classes, 'rounded-tl-md');
    }
    if(position=="h1"){
      classes = twMerge(classes, 'rounded-br-md');
    }
    if(position=="h8"){
      classes = twMerge(classes, 'rounded-tr-md');
    }
    return classes;
  };
  //dragging feature
  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    setPieceImg(e.target as HTMLImageElement)
    setStartPos({x:e.clientX, y:e.clientY})
    updateMove(cell, turn, position);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDrag = (e: React.DragEvent<HTMLImageElement>) => {
    if(!pieceImg) return;
    pieceImg.style.opacity = "0"
  };
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if(!pieceImg) return;
    pieceImg.style.opacity = "1"
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isDisable) {
      updateMove(cell, turn, position);
    }
  };
  let classes = stylesforCell();
  return (
    <div
      onClick={() => {
        !isDisable && updateMove(cell, turn, position);
      }}
      className={`${classes} relative flex items-center justify-center select-none`}
      onDragOver={(e) => {
        handleDragOver(e);
      }}
      onDrop={(e) => handleDrop(e)}
    >
      {cell && (
        <img
          src={`/pieces/${cell.color}${cell.type}.svg`}
          draggable
          onDragStart={(e) => {
            handleDragStart(e);
          }}
          onDrag={(e)=>handleDrag(e)}
          onDragEnd={(e) => handleDragEnd(e)}
          className={'w-[95%] left-28'}
        />
      )}
      {/* show possible legal moves */}
      {showLegalMoves && legalMoves.includes(position) && (
        <span
          className={twMerge(
            'bg-[rgba(0,0,0,0.2)] absolute w-[var(--legalCircle)] h-[var(--legalCircle)] rounded-full',
            cell &&
              'w-full h-full border-[5px] border-[rgba(0,0,0,0.3)] bg-transparent'
          )}
        ></span>
      )}
      {/* display corresponding position at the bottom row and first column */}
      {position[0] == 'a' && (
        <span
          className={`${Number(position[1]) % 2 == 0 ? 'text-blue-500' : 'text-white'} absolute top-0 left-1`}
        >
          {position[1]}
        </span>
      )}
      {position[1] == '1' && (
        <span
          className={`${(position.charCodeAt(0) - 97) % 2 == 0 ? 'text-white' : 'text-blue-500'} absolute bottom-0 right-1`}
        >
          {position[0]}
        </span>
      )}
      {/* If there is going to be a promotion, display promotion options*/}
      {showPromotionOption.canShow &&
        showPromotionOption.position == position && (
          <PromotionOptions
            player={turn}
            updateMove={updateMove}
            cell={cell}
            turn={turn}
            position={position}
          />
        )}
    </div>
  );
}
