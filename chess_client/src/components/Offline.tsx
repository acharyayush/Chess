import ChessBoard from './ChessBoard';
import GameOverPopUp from './GameOverPopUp';
import PlayerInfo from './PlayerInfo';
import Button from './shared/Button';
import SwitchToggle from './shared/SwitchToggle';
import { TbArrowBigLeftFilled } from 'react-icons/tb';
import { FaFlag } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import MoveHistory from './MoveHistory';
import { setHasResigned } from '../state/gameStatus/gameStatusSlice';
import { setShowLegalMoves, setUndo } from '../state/chess/chessSlice';
import { useDispatch } from 'react-redux';
import useChessGame from '../hooks/useChessGame';
export default function Offline() {
  
  useChessGame();

  const dispatch = useDispatch();
  const { showLegalMoves, moveHistory } = useSelector(
    (state: RootState) => state.chess
  );
  const { whiteNetScore, capturedPiecesByWhite, capturedPiecesByBlack } =
    useSelector((state: RootState) => state.players);
  const { isGameOver } = useSelector((state: RootState) => state.gameStatus);
  
  return (
    <div className='bg-slate-700 min-h-screen p-5 xsm:p-2'>
      <div className='w-[90%] xl:w-[100%] mx-auto flex justify-evenly lg:flex-col lg:items-center'>
        <div className='boardSectionContainer lg:mb-6'>
          <div className='boardSection'>
            {/* Logo, Name of player 1 */}
            <PlayerInfo
              className='mb-2'
              player='b'
              name='Black'
              rating={1200}
              score={whiteNetScore}
              capturedPieces={capturedPiecesByBlack}
            />
            {/* Chess Board */}
            <div className='relative inline-block'>
              {isGameOver && (
                <GameOverPopUp className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
              )}
              <ChessBoard isDisable={isGameOver} />
            </div>
            {/* Logo, Name of player 2 */}
            <PlayerInfo
              className='mt-2'
              player='w'
              name='White'
              rating={1200}
              score={whiteNetScore}
              capturedPieces={capturedPiecesByWhite}
            />
          </div>
        </div>
        <div className='text-white gameDetailSection bg-[#465f83c9] shadow-md max-w-[480px] w-[100%] rounded-md lg:flex lg:flex-col-reverse'>
          <MoveHistory />
          <div className='settings p-4 h-[132px]'>
            <div className='buttons flex'>
              <Button
                isDisable={isGameOver}
                onClick={() =>
                  moveHistory.length > 0 && dispatch(setUndo(true))
                }
                noShadow
                className='undo hover:bg-[rgba(0,0,0,0.3)] px-8 py-3 ml-0 mr-2 bg-[rgba(0,0,0,0.2)]'
              >
                {' '}
                <TbArrowBigLeftFilled />
              </Button>{' '}
              <Button
                isDisable={isGameOver}
                allowModal
                modalTitle='Are you sure you want to resign?'
                onClick={() => dispatch(setHasResigned(true))}
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
                  onToggle={() => dispatch(setShowLegalMoves(!showLegalMoves))}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
