import { Square } from 'chess.js';
import useChessGame from '../hooks/useChessGame';
import ChessBoard from './ChessBoard';
import GameOverPopUp from './GameOverPopUp';
import PlayerInfo from './PlayerInfo';
import Button from './shared/Button';
import SwitchToggle from './shared/SwitchToggle';
import { TbArrowBigLeftFilled } from 'react-icons/tb';
import { FaFlag } from 'react-icons/fa';
import { useContext, useEffect, useRef } from 'react';
import { ChessGameContext } from '../context/ChessGameContext';
import extractPosition from '../utils/extractPosition';
import { GameControlContext } from '../context/GameControlContext';

export default function Offline() {
  const {
    board,
    turn,
    move,
    updateMove,
    winner,
    isDraw,
    gameOverDesc,
    isGameOver,
    inCheck,
  } = useChessGame();
  const { chess, setLegalMoves} = useContext(ChessGameContext);
  const { showLegalMoves, setShowLegalMoves, playedMoves, setHasResigned, setUndo} =
    useContext(GameControlContext);
    const historyDiv = useRef<HTMLDivElement>(null);

  //calculate legal moves if showLegalMoves is toggled to active (to sync with the board)
  useEffect(() => {
    if (!showLegalMoves || !move.from) return;
    let moves = chess
      .moves({ square: move?.from as Square })
      .map((move) => extractPosition(move, turn));
    setLegalMoves(moves);
  }, [showLegalMoves]);

  useEffect(() => {
    if (historyDiv.current) {
      historyDiv.current.scrollTop = historyDiv.current.scrollHeight;
    }
  }, [playedMoves]);
  const renderhistory = () => {
    const historyMoves: JSX.Element[] = [];
    let isEvenMoves = playedMoves.length % 2 == 0;
    let len = isEvenMoves ? playedMoves.length : playedMoves.length - 1;
    let count = 1;
    for (let i = 0; i < len; i += 2) {
      let myRow = (
        <div
          key={count}
          className={`${count % 2 == 0 && 'bg-[rgba(255,255,255,0.05)]'} py-0.5`}
        >
          <div className='count w-[50px] inline-block pl-4'>{`${count}. `}</div>
          <div className='whiteMove w-[100px] inline-block'>
            <span className={`px-2 rounded-sm `}>{playedMoves[i]}</span>
          </div>
          <div className='blackMove w-[100px] inline-block'>
            <span
              className={`px-2 rounded-sm ${i + 1 == playedMoves.length - 1 && 'bg-[rgba(255,255,255,0.2)]'}`}
            >
              {playedMoves[i + 1]}
            </span>
          </div>
        </div>
      );
      historyMoves.push(myRow);
      count++;
    }
    if (!isEvenMoves) {
      let myRow = (
        <div
          key={count}
          className={`${count % 2 == 0 && 'bg-[rgba(255,255,255,0.05)]'} py-0.5`}
        >
          <div className='count w-[50px] inline-block pl-4'>{`${count}. `}</div>
          <div className='whiteMove w-[100px] inline-block'>
            <span className='bg-[rgba(255,255,255,0.2)] px-2 rounded-sm'>
              {playedMoves[len]}
            </span>
          </div>
        </div>
      );
      historyMoves.push(myRow);
    }

    return historyMoves;
  };
  return (
    <div className='bg-slate-700 w-screen min-h-screen p-5 xsm:p-2'>
      <div className='w-[90%] xl:w-[100%] mx-auto flex justify-evenly lg:flex-col lg:items-center'>
        <div className='boardSectionContainer lg:mb-6'>
          <div className='boardSection'>
            {/* Logo, Name of player 1 */}
            <PlayerInfo player='b' name='Black' rating={1200} />
            {/* Chess Board */}
            <div className='relative inline-block'>
              {isGameOver && (
                <GameOverPopUp
                  isDraw={isDraw}
                  gameOverDesc={gameOverDesc}
                  winner={winner}
                  className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                />
              )}
              <ChessBoard
                isDisable={isGameOver}
                board={board}
                activeSquare={move?.from as Square}
                updateMove={updateMove}
                turn={turn}
                inCheck={inCheck}
              />
            </div>
            {/* Logo, Name of player 2 */}
            <PlayerInfo player='w' name='White' rating={1200} />
          </div>
        </div>
        <div className='text-white gameDetailSection bg-[#465f83c9] shadow-md max-w-[480px] w-[100%] rounded-md lg:flex lg:flex-col-reverse'>
          <div
            className='history scrollbar-hide scrollbar-custom h-[460px] overflow-y-auto pt-8'
            ref={historyDiv}
          >
            <h1 className='text-lg border-b-2 mb-3 pb-2 mx-4'>History</h1>
            <div>{renderhistory()}</div>
          </div>
          <div className='settings p-4 h-[132px]'>
            <div className='buttons flex'>
              {/* setUndo(prev=>!prev), wait for preceeding undo, after renders -> undo is false -> now, perform current undo*/}
              <Button isDisable={isGameOver} onClick={()=>{setUndo((prev)=>!prev)}} noShadow className='undo hover:bg-[rgba(0,0,0,0.3)] px-8 py-3 ml-0 mr-2 bg-[rgba(0,0,0,0.2)]'>                <TbArrowBigLeftFilled /></Button>{' '}
              <Button
              isDisable={isGameOver}
              allowModal
              modalTitle='Are you sure you want to resign?'
              onClick={()=>setHasResigned(true)}
                noShadow
                className='resign hover:bg-[rgba(0,0,0,0.3)] px-8 py-3 ml-0 mr-2 bg-[rgba(0,0,0,0.2)]'
              >
                <FaFlag className='scale-75' />
              </Button>
            </div>
            <div className='additionalSettings text-lg text-white pl-2 pr-8 xsm:pr-2 flex items-center justify-between'>
              <span className=''>Show Legal Moves</span>
              <span className='flex items-center'>
                <SwitchToggle
                  status={showLegalMoves}
                  onToggle={() =>
                    setShowLegalMoves((prevStatus) => !prevStatus)
                  }
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
