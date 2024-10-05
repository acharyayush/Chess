import { BLACK, Color, Square } from 'chess.js';
import Cell from './Cell';
import { twMerge } from 'tailwind-merge';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { Board } from '../../types';
import { useRef } from 'react';

interface ChessBoardProps {
  board: Board;
  isDisable: boolean;
  turn: Color;
  className?: string;
}

export default function ChessBoard({
  board,
  turn,
  isDisable,
  className,
}: ChessBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const { mainPlayer } = useSelector((state: RootState) => state.players);
  const start = mainPlayer === BLACK ? 7 : 0;
  const end = mainPlayer === BLACK ? -1 : 8;
  const step = mainPlayer === BLACK ? -1 : 1;
  function displayBoard(): JSX.Element[][] {
    if (board.length === 0) return [];
    const renderedBoard: JSX.Element[][] = [];
    for (let i = start; i != end; i += step) {
      const row: JSX.Element[] = [];
      for (let j = start; j != end; j += step) {
        const position = (String.fromCharCode(97 + j) + (8 - i)) as Square;
        const cellColor = (i + j) % 2 == 0 ? 'bg-white ' : 'bg-blue-500 ';
        row.push(
          <Cell
            boardRef={boardRef}
            key={position}
            turn={turn}
            cellColor={cellColor}
            cell={board[i][j]}
            isDisable={isDisable}
            position={position}
          />
        );
      }
      renderedBoard.push(row);
    }
    return renderedBoard;
  }
  //w-[var(--chessboard-size)] h-[var(--chessboard-size)]
  return (
    <div
      ref={boardRef}
      className={twMerge(
        `ChessBoard grid grid-cols-8 grid-rows-8 sm:w-[100%] sm:h-auto}`,
        className
      )}
    >
      {displayBoard()}
    </div>
  );
}
