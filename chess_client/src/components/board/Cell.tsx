//TODO: Make a dragging feature

import { BLACK, Color, KING, PieceSymbol, Square, WHITE } from 'chess.js';
import PromotionOptions from './PromotionOptions';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { updateMove } from '../../state/chess/chessSlice';
import { useDispatch } from 'react-redux';
interface CellProps {
  cell: {
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null;
  cellColor: string;
  position: string;
  isDisable: boolean;
}
export default function Cell({
  cell,
  cellColor,
  position,
  isDisable,
}: CellProps) {
  const { legalMoves, turn, showPromotionOption } = useSelector(
    (state: RootState) => state.chess
  );
  const dispatch = useDispatch();
  const { showLegalMoves, move } = useSelector(
    (state: RootState) => state.chess
  );
  const { isCheck } = useSelector((state: RootState) => state.gameStatus);
  const { mainPlayer } = useSelector((state: RootState) => state.players);
  const [pieceImg, setPieceImg] = useState<HTMLImageElement>();
  // const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const stylesforCell = () => {
    const activeSquare = move.from;
    let classes = cellColor;

    if (cell) {
      classes = twMerge(classes, 'cursor-pointer');
    }
    if (isCheck && turn == cell?.color && cell?.type == KING) {
      classes = twMerge(classes, '!bg-red-300');
    }
    if (activeSquare === position) {
      classes = twMerge(classes, '!bg-blue-300');
    }
    if (position == 'a1') {
      classes = twMerge(classes, 'rounded-bl-md');
    }
    if (position == 'a8') {
      classes = twMerge(classes, 'rounded-tl-md');
    }
    if (position == 'h1') {
      classes = twMerge(classes, 'rounded-br-md');
    }
    if (position == 'h8') {
      classes = twMerge(classes, 'rounded-tr-md');
    }
    return classes;
  };
  const displayBoardIdx = () => {
    const compareWith = mainPlayer == WHITE ? 0 : 1;
    const indices: JSX.Element[] = [];
    if (
      (mainPlayer == WHITE && position[0] == 'a') ||
      (mainPlayer == BLACK && position[0] == 'h')
    )
      indices.push(
        <span
          key={`letter-${position}`}
          className={`${Number(position[1]) % 2 == compareWith ? 'text-blue-500' : 'text-white'} absolute  ${mainPlayer == BLACK ? 'rotate-180 bottom-0 right-1' : 'top-0 left-1'}`}
        >
          {position[1]}
        </span>
      );
    if (
      (mainPlayer == WHITE && position[1] == '1') ||
      (mainPlayer == BLACK && position[1] == '8')
    )
      indices.push(
        <span
          key={`num-${position}`}
          className={`${(position.charCodeAt(0) - 97) % 2 == compareWith ? 'text-white' : 'text-blue-500'} absolute ${mainPlayer == BLACK ? 'rotate-180 top-0 left-1' : 'bottom-0 right-1'}`}
        >
          {position[0]}
        </span>
      );
    return indices;
  };

  //dragging feature
  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    if (isDisable) return;
    setPieceImg(e.target as HTMLImageElement);
    // setStartPos({ x: e.clientX, y: e.clientY });
    dispatch(updateMove({ cell, position }));
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDrag = () => {
    if (!pieceImg) return;
    pieceImg.style.opacity = '0';
  };
  const handleDragEnd = () => {
    if (!pieceImg) return;
    pieceImg.style.opacity = '1';
  };
  const handleDrop = () => {
    if (isDisable) return;
    dispatch(updateMove({ cell, position }));
  };
  const classes = stylesforCell();
  return (
    <div
      onClick={handleDrop}
      className={`${classes} relative flex items-center justify-center select-none sm:w-auto sm:h-auto`}
      onDragOver={(e) => {
        handleDragOver(e);
      }}
      onDrop={handleDrop}
    >
      {cell && (
        <img
          src={`/pieces/${cell.color}${cell.type}.svg`}
          draggable
          onDragStart={(e) => {
            handleDragStart(e);
          }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className={`w-[95%] left-28 ${cell.color == BLACK && 'rotate-180'}`}
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
      {displayBoardIdx()}
      {/* If there is going to be a promotion, display promotion options*/}
      {showPromotionOption.canShow &&
        showPromotionOption.position == position && (
          <PromotionOptions player={turn} />
        )}
    </div>
  );
}
