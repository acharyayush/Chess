import { Square } from 'chess.js';
import useChessGame from '../hooks/useChessGame';
import ChessBoard from './ChessBoard';
import GameOverPopUp from './GameOverPopUp';
import PlayerInfo from './PlayerInfo';
export default function Offline() {
  const {
    board,
    turn,
    move,
    updateMove,
    winner,
    isDraw,
    isStalemate,
    isGameOver,
    inCheck,
  } = useChessGame();
  return (
    <div className='bg-slate-400 w-screen min-h-screen p-5'>
      <div className='boardSection'>
        {/* Logo, Name of player 1 */}
        <PlayerInfo player='b' name='Black' rating={1200}/>
        {/* Chess Board */}
        <div className='relative inline-block'>
          {isGameOver && <GameOverPopUp isDraw={isDraw} isStalemate = {isStalemate} winner={winner} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>}
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
        <PlayerInfo player='w' name='White' rating={1200}/>
      </div>
      <div className='gameDetailSection'></div>
    </div>
  );
}
