import { BLACK, Color, Square } from 'chess.js';
import Cell from './Cell';
import { twMerge } from 'tailwind-merge';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { type ArrowType, Board } from '../../types';
import { useEffect, useRef, useState } from 'react';
import Arrow from '../analysis/Arrow';
import { useDispatch } from 'react-redux';
import { setRemoveAnalysisStyle } from '../../state/analysis/analysisSlice';

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
  const dispatch = useDispatch();
  const boardRef = useRef<HTMLDivElement>(null);
  const { mainPlayer } = useSelector((state: RootState) => state.players);
  const { removeAnalysisStyle } = useSelector(
    (state: RootState) => state.analysis
  );
  //arrow contains start and end cell which are of type react ref. so this cannot be placed in redux as they are non serializable. So arrow is used as local state
  const [arrows, setArrows] = useState<ArrowType[]>([]);
  const [boardPos, setBoardPos] = useState({ x: 0, y: 0 });
  const [arrowStartCell, setArrowStartCell] =
    useState<React.RefObject<HTMLDivElement> | null>(null);
  const addArrow = (arrow: ArrowType) => {
    //whenever arrow is added, removeAnalysisStyle is set to false becoming READY to remove the arrows and red overlays.
    dispatch(setRemoveAnalysisStyle(false));
    setArrows((prevState) => {
      const arrowIndex = prevState.findIndex(
        (el) => el.start === arrow.start && el.end === arrow.end
      );
      if (arrowIndex !== -1) {
        // Remove arrow if it already exists
        return prevState.filter((_, index) => index != arrowIndex);
      } else {
        // If arrowToAdd does not exist in arrows then add it
        return [...prevState, arrow];
      }
    });
  };
  useEffect(() => {
    if (boardRef.current) {
      setBoardPos({
        x: boardRef.current?.getBoundingClientRect().left,
        y: boardRef.current?.getBoundingClientRect().top,
      });
    }
  }, [boardRef.current]);
  useEffect(() => {
    if (removeAnalysisStyle) setArrows([]);
  }, [removeAnalysisStyle]);
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
            addArrow={addArrow}
            arrowStartCell={arrowStartCell}
            setArrowStartCell={setArrowStartCell}
          />
        );
      }
      renderedBoard.push(row);
    }
    return renderedBoard;
  }
  return (
    <>
      <div
        ref={boardRef}
        className={twMerge(
          `ChessBoard grid grid-cols-8 grid-rows-8 sm:w-[100%] sm:h-auto}`,
          className
        )}
      >
        {displayBoard()}
      </div>
      {arrows.map((arrow, index) => (
        <Arrow
          key={`arrow-${index}`}
          boardPos={boardPos}
          startCell={arrow.start}
          endCell={arrow.end}
        />
      ))}
    </>
  );
}
