import { Chess, Color, KING, PieceSymbol, Square } from 'chess.js';
import { CommonCellAndChessProps } from '../types';
import PromotionOptions from './PromotionOptions';
import Cell from './Cell';
import { twMerge } from 'tailwind-merge';

interface ChessBoardProps extends CommonCellAndChessProps{
  board: ReturnType<Chess['board']>;
  isDisable: boolean;
  className?: string;
}

export default function ChessBoard({
  board,
  activeSquare,
  updateMove,
  turn,
  isDisable,
  inCheck,
  className
}: ChessBoardProps) {
  function displayBoard(): JSX.Element[][] {
    return board.map((row, i) => {
      return row.map((cell, j) => {
        let position = (String.fromCharCode(97 + j) + (8 - i)) as Square;
        let cellColor = (i + j) % 2 == 0 ? 'bg-white ' : 'bg-blue-500 '
        return (
          <Cell
            inCheck={inCheck}
            key={position}
            turn={turn}
            cellColor = {cellColor}
            cell={cell}
            isDisable = {isDisable}
            position={position}
            activeSquare={activeSquare}
            updateMove={updateMove}
          />
        );
      });
    });
  }
  return (
    <div className={twMerge("w-[var(--chessboard-size)] h-[var(--chessboard-size)] grid grid-cols-8 grid-rows-8", className)}>
      {displayBoard()}
    </div>
  );
}
