import ChessBoard from '../components/board/ChessBoard';
import Loader from '../components/loading/Loader';
import LoaderContainer from '../components/loading/LoaderContainer';
import GameOverPopUp from '../components/GameOverPopUp';
import { RootState } from '../state/store';
import { useSelector } from 'react-redux';
import useSocket from '../hooks/useSocket';
import BoardSectionContainer from '../components/BoardSectionContainer';
import PlayerInfo from '../components/playerInfo/PlayerInfo';
import { BLACK, WHITE } from 'chess.js';
import GameDetailContainer from '../components/gameDetail/GameDetailContainer';
import MoveHistory from '../components/gameDetail/MoveHistory';
import Button from '../components/shared/Button';
import { FaFlag } from 'react-icons/fa';
import SwitchToggle from '../components/shared/SwitchToggle';
import { useDispatch } from 'react-redux';
import { setShowLegalMoves } from '../state/chess/chessSlice';
import socket from '../socket';
import { REJECT_REMATCH, REMATCH, RESIGN } from '../events';
import RequestModal from '../components/shared/RequestModal';
import { setShowRematchRequest } from '../state/gameStatus/gameStatusSlice';
export default function Online() {
  const { board, moveHistory, turn, showLegalMoves } = useSelector(
    (state: RootState) => state.chess
  );
  const { isGameOver, showRematchRequest } = useSelector(
    (state: RootState) => state.gameStatus
  );
  const {
    mainPlayer,
    player1,
    player2,
    whiteNetScore,
    capturedPiecesByWhite,
    capturedPiecesByBlack,
  } = useSelector((state: RootState) => state.players);
  const dispatch = useDispatch();
  const { success } = useSocket();
  const renderPage = () => {
    return (
      <div className='bg-slate-700 min-h-screen p-5 xsm:p-2 grid items-center'>
        {!success && (
          <LoaderContainer className='h-full flex items-center justify-center'>
            <>
              <div
                style={{ WebkitTextStroke: '1px #4172b9' }}
                className='bgText absolute w-full top-1/2 text-[5rem] -translate-y-1/2 font-bold text-transparent text-center animate-pulse md:text-[4rem] sm:text-[3rem] xsm:text-[2rem]'
              >
                waiting for your opponent
              </div>
              <Loader className='sm:!w-[120px] sm:!h-[120px]' />
            </>
          </LoaderContainer>
        )}
        {success && (
          <div className='w-[90%] h-fit xl:w-[100%] mx-auto flex justify-evenly lg:flex-col lg:items-center gap-4'>
            {/* container height is 80vh. BoardSectionContainer width should be equal to board width and board should be square. So boardWidth = boardHeight = 80vh - 2*50px (playerInfo height) - 2*16px (gap) */}
            <BoardSectionContainer
              style={{ width: `calc(90vh - 100px - 32px)` }}
              className='h-[90vh] md:h-auto sm:h-screen gap-4 md:!w-auto'
            >
              {/* Logo, Name of player 1 */}
              <PlayerInfo
                className='mb-2'
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
              <div className='relative inline-block'>
                {isGameOver && (
                  <GameOverPopUp className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
                )}
                <ChessBoard
                  board={board}
                  turn={turn}
                  isDisable={isGameOver || turn != mainPlayer}
                />
              </div>
              {/* Logo, Name of player 2 */}
              <PlayerInfo
                className='mt-2'
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

            <GameDetailContainer className='GameDetailContainer sm:max-w-full h-[90vh] lg:h-[600px]'>
              <MoveHistory className='flex-grow' moveHistory={moveHistory} />
              <div className='settings p-4'>
                <div className='buttons flex'>
                  <Button
                    isDisable={isGameOver}
                    allowModal
                    modalTitle='Are you sure you want to resign?'
                    noShadow
                    className='resign hover:bg-[rgba(0,0,0,0.3)] px-8 py-3 ml-0 mr-2 bg-[rgba(0,0,0,0.2)]'
                    onClick={() => {
                      socket.emit(RESIGN);
                    }}
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
                </div>
              </div>
            </GameDetailContainer>
          </div>
        )}
        {showRematchRequest && (
          <RequestModal
            onAccept={() => {
              socket.emit(REMATCH);
            }}
            onReject={() => {
              socket.emit(REJECT_REMATCH);
            }}
            onRemove={() => dispatch(setShowRematchRequest(false))}
            requestText={`${mainPlayer === WHITE ? player2 : player1} requests a rematch. Do you accept?`}
          />
        )}
      </div>
    );
  };
  return renderPage();
}
