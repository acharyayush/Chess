import { Square } from 'chess.js';
import Cell from './Cell';
import { twMerge } from 'tailwind-merge';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';

interface ChessBoardProps {
  isDisable: boolean;
  className?: string;
}

export default function ChessBoard({
  isDisable,
  className,
}: ChessBoardProps) {
  const {board} = useSelector((state:RootState)=>state.chess);
  function displayBoard(): JSX.Element[][] {
    return board.map((row, i) => {
      return row.map((cell, j) => {
        let position = (String.fromCharCode(97 + j) + (8 - i)) as Square;
        let cellColor = (i + j) % 2 == 0 ? 'bg-white ' : 'bg-blue-500 ';
        return (
          <Cell
            key={position}
            cellColor={cellColor}
            cell={cell}
            isDisable={isDisable}
            position={position}
          />
        );
      });
    });
  }
  return (
    <div
      className={twMerge(
        'w-[var(--chessboard-size)] h-[var(--chessboard-size)] grid grid-cols-8 grid-rows-8 sm:w-[100%] sm:h-auto',
        className
      )}
    >
      {displayBoard()}
    </div>
  );
}
