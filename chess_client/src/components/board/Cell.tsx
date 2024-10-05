import { BLACK, Color, KING, PieceSymbol, Square, WHITE } from 'chess.js';
import PromotionOptions from './PromotionOptions';
import { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { updateMove } from '../../state/chess/chessSlice';
import { useDispatch } from 'react-redux';
const emptyImg = new Image();
//1x1 pixel transparent GIF image. Doesn't display anything visually because it is completely transparent, meaning it has no color or detail.
emptyImg.src =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
console.log(emptyImg);
interface CellProps {
  cell: {
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null;
  turn: Color;
  cellColor: string;
  position: string;
  isDisable: boolean;
  boardRef: React.RefObject<HTMLDivElement>;
}
export default function Cell({
  cell,
  turn,
  cellColor,
  position,
  isDisable,
  boardRef,
}: CellProps) {
  const { legalMoves, showPromotionOption } = useSelector(
    (state: RootState) => state.chess
  );
  const dispatch = useDispatch();
  const { showLegalMoves, move, prevMove, isOnline } = useSelector(
    (state: RootState) => state.chess
  );
  const { isCheck } = useSelector((state: RootState) => state.gameStatus);
  const { mainPlayer } = useSelector((state: RootState) => state.players);
  const targetImg = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const clampToBoardSize = (value: number, direction: 'x' | 'y') => {
    const board = boardRef.current;
    if (!board) return value;
    if (direction == 'x')
      return Math.max(
        board.getBoundingClientRect().left,
        Math.min(value, board?.getBoundingClientRect().right)
      );
    return Math.max(
      board.getBoundingClientRect().top,
      Math.min(value, board?.getBoundingClientRect().bottom)
    );
  };
  const stylesforCell = () => {
    const activeSquare = move.from;
    let classes = cellColor;

    if (cell) {
      classes = twMerge(classes, 'cursor-grab');
    }
    if (isCheck && turn == cell?.color && cell?.type == KING) {
      classes = twMerge(classes, '!bg-red-300');
    }
    if (prevMove.from == position) classes = twMerge(classes, 'bg-green-100');
    if (prevMove.to == position) classes = twMerge(classes, 'bg-green-200');
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
          className={`${Number(position[1]) % 2 == compareWith ? 'text-blue-500' : 'text-white'} absolute sm:text-sm  top-0 left-1`}
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
          className={`${(position.charCodeAt(0) - 97) % 2 == compareWith ? 'text-white' : 'text-blue-500'} absolute sm:text-sm bottom-0 right-1`}
        >
          {position[0]}
        </span>
      );
    return indices;
  };

  //dragging feature
  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    if (isDisable) return;
    setIsDragging(true);
    e.dataTransfer.setDragImage(emptyImg, 50, 50);
    const imgElement = e.target as HTMLImageElement;
    setPos({
      x: imgElement.getBoundingClientRect().left,
      y: imgElement.getBoundingClientRect().top,
    });
    dispatch(updateMove({ cell, position }));
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (!targetImg.current) return;
    targetImg.current.style.left = `calc(${clampToBoardSize(e.clientX, 'x') - pos.x}px - 50%)`;
    targetImg.current.style.top = `calc(${clampToBoardSize(e.clientY, 'y') - pos.y}px - 50%)`;
  };
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  const handleDrop = () => {
    if (isDisable) return;
    dispatch(updateMove({ cell, position }));
  };
  const classes = stylesforCell();
  return (
    <div
      onClick={handleDrop}
      className={`${classes} relative flex items-center justify-center select-none aspect-square`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {cell && (
        <>
          <img
            src={`/pieces/${cell.color}${cell.type}.svg`}
            draggable
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className={`w-[95%] absolute z-40 ${isDragging ? 'opacity-0' : 'z-30'} ${mainPlayer != cell.color && !isOnline ? 'rotate-180' : ''}`}
          />
          {isDragging && (
            <img
              ref={targetImg}
              src={`/pieces/${cell.color}${cell.type}.svg`}
              className={` pointer-events-none cursor-grabbing relative z-50 DraggableCopyOfPiece w-[95%] ${mainPlayer != cell.color && !isOnline ? 'rotate-180' : ''}`}
            />
          )}
        </>
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
