import ChessBoard from '../components/board/ChessBoard';
import GameOverPopUp from '../components/GameOverPopUp';
import PlayerInfo from '../components/playerInfo/PlayerInfo';
import Button from '../components/shared/Button';
import SwitchToggle from '../components/shared/SwitchToggle';
import { TbArrowBigLeftFilled } from 'react-icons/tb';
import { FaFlag } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import MoveHistory from '../components/gameDetail/MoveHistory';
import { setHasResigned } from '../state/gameStatus/gameStatusSlice';
import {
  setEnableTimer,
  setShowLegalMoves,
  setUndo,
} from '../state/chess/chessSlice';
import { useDispatch } from 'react-redux';
import { BLACK, WHITE } from 'chess.js';
import useChessGameOffline from '../hooks/useChessGameOffline';
import GameDetailContainer from '../components/gameDetail/GameDetailContainer';
import BoardSectionContainer from '../components/BoardSectionContainer';
export default function Offline() {
  useChessGameOffline();

  const dispatch = useDispatch();
  const { board, turn, showLegalMoves, moveHistory, enableTimer } = useSelector(
    (state: RootState) => state.chess
  );
  const {
    player1,
    player2,
    whiteNetScore,
    capturedPiecesByWhite,
    capturedPiecesByBlack,
    mainPlayer,
  } = useSelector((state: RootState) => state.players);
  const { isGameOver } = useSelector((state: RootState) => state.gameStatus);

  return (
    <div className='bg-slate-700 min-h-screen p-5 xsm:p-2 grid items-center'>
      <div className='w-[90%] h-fit xl:w-[100%] mx-auto flex justify-evenly lg:flex-col lg:items-center gap-4'>
        {/* container height is 80vh. BoardSectionContainer width should be equal to board width and board should be square. So boardWidth = boardHeight = 80vh - 2*50px (playerInfo height) - 2*16px (gap) */}
        <BoardSectionContainer
          style={{ width: `calc(90vh - 100px - 32px)` }}
          className='h-[90vh] md:h-auto sm:h-screen gap-4 md:!w-auto'
        >
          {/* Logo, Name of player 1 */}
          <PlayerInfo
            className='h-[50px]'
            color={mainPlayer == WHITE ? BLACK : WHITE}
            name={mainPlayer == WHITE ? player2 : player1}
            rating={1200}
            score={whiteNetScore}
            capturedPieces={
              mainPlayer == WHITE
                ? capturedPiecesByBlack
                : capturedPiecesByWhite
            }
          />
          {/* Chess Board */}
          <div className='relative grow sm:grow-0'>
            {isGameOver && (
              <GameOverPopUp className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
            )}
            <ChessBoard
              className='h-full aspect-square'
              board={board}
              turn={turn}
              isDisable={isGameOver}
            />
          </div>
          {/* Logo, Name of player 2 */}
          <PlayerInfo
            className='h-[50px]'
            color={mainPlayer}
            name={mainPlayer == WHITE ? player1 : player2}
            rating={1200}
            score={whiteNetScore}
            capturedPieces={
              mainPlayer == WHITE
                ? capturedPiecesByWhite
                : capturedPiecesByBlack
            }
          />
        </BoardSectionContainer>
        {/* has some external css for GameDetailContainer in index.css */}
        <GameDetailContainer className='GameDetailContainer sm:max-w-full h-[90vh] lg:h-[600px]'>
          <MoveHistory moveHistory={moveHistory} className='flex-grow' />
          <div className='settings p-4'>
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
            <div className='additionalSettings text-lg text-white pl-2 pr-8 xsm:pr-2'>
              <div className='showLegalMoves flex items-center justify-between'>
                <span className=''>Show Legal Moves</span>
                <span className='flex items-center'>
                  <SwitchToggle
                    status={showLegalMoves}
                    onToggle={() =>
                      dispatch(setShowLegalMoves(!showLegalMoves))
                    }
                  />
                </span>
              </div>
              <div className='enableTimer flex items-center justify-between mt-3'>
                <span className=''>Enable Timer</span>
                <span className='flex items-center'>
                  <SwitchToggle
                    status={enableTimer}
                    onToggle={() => dispatch(setEnableTimer(!enableTimer))}
                  />
                </span>
              </div>
            </div>
          </div>
        </GameDetailContainer>
      </div>
    </div>
  );
}
