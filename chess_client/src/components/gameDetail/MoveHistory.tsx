import { useEffect, useRef } from 'react';
interface MoveHistoryProps {
  moveHistory: string[];
}
function MoveHistory({ moveHistory }: MoveHistoryProps) {
  const historyDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (historyDiv.current) {
      historyDiv.current.scrollTop = historyDiv.current.scrollHeight;
    }
  }, [moveHistory]);
  const renderhistory = () => {
    const historyMoves: JSX.Element[] = [];
    const isEvenMoves = moveHistory.length % 2 == 0;
    const len = isEvenMoves ? moveHistory.length : moveHistory.length - 1;
    let count = 1;
    for (let i = 0; i < len; i += 2) {
      const myRow = (
        <div
          key={count}
          className={`${count % 2 == 0 && 'bg-[rgba(255,255,255,0.05)]'} py-0.5`}
        >
          <div className='count w-[50px] inline-block pl-4'>{`${count}. `}</div>
          <div className='whiteMove w-[100px] inline-block'>
            <span className={`px-2 rounded-sm `}>{moveHistory[i]}</span>
          </div>
          <div className='blackMove w-[100px] inline-block'>
            <span
              className={`px-2 rounded-sm ${i + 1 == moveHistory.length - 1 && 'bg-[rgba(255,255,255,0.2)]'}`}
            >
              {moveHistory[i + 1]}
            </span>
          </div>
        </div>
      );
      historyMoves.push(myRow);
      count++;
    }
    if (!isEvenMoves) {
      const myRow = (
        <div
          key={count}
          className={`${count % 2 == 0 && 'bg-[rgba(255,255,255,0.05)]'} py-0.5`}
        >
          <div className='count w-[50px] inline-block pl-4'>{`${count}. `}</div>
          <div className='whiteMove w-[100px] inline-block'>
            <span className='bg-[rgba(255,255,255,0.2)] px-2 rounded-sm'>
              {moveHistory[len]}
            </span>
          </div>
        </div>
      );
      historyMoves.push(myRow);
    }

    return historyMoves;
  };
  return (
    <div
      className='history scrollbar-hide scrollbar-custom h-[460px] overflow-y-auto pt-8'
      ref={historyDiv}
    >
      <h1 className='text-lg border-b-2 mb-3 pb-2 mx-4'>History</h1>
      <div>{renderhistory()}</div>
    </div>
  );
}

export default MoveHistory;
