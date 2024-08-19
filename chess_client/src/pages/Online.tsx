import ChessBoard from '../components/board/ChessBoard';
import Loader from '../components/loading/Loader';
import LoaderContainer from '../components/loading/LoaderContainer';
import GameOverPopUp from '../components/GameOverPopUp';
import { RootState } from '../state/store';
import { useSelector } from 'react-redux';
import useSocket from '../hooks/useSocket';
import useChessGame from '../hooks/useChessGame';
export default function Online() {
  useChessGame()
  const { isOnline, turn } = useSelector((state: RootState) => state.chess);
  const { isGameOver } = useSelector((state: RootState) => state.gameStatus);
  const { mainPlayer } = useSelector((state: RootState) => state.players);
  // const dispatch = useDispatch()
  const {success} = useSocket()
  // useEffect(()=>{
  //   dispatch(setBoard(chess.board()))
  // }, [])

  const renderPage = () => {
    return (
      <div className='bg-slate-700 min-h-screen'>
        {!success && (
          <LoaderContainer className='h-screen flex items-center justify-center'>
            <>
              <div
                style={{ WebkitTextStroke: '1px #4172b9' }}
                className='bgText absolute w-full top-1/2 text-[5rem] -translate-y-1/2 font-bold text-transparent text-center animate-pulse md:text-[4rem] sm:text-[3rem] xsm:text-[2rem]'
              >
                waiting for your opponent
              </div>
              <Loader className='sm:!w-[120px] sm:!h-[120px]'/>
            </>
          </LoaderContainer>
        )}
        {/* {success && <ChessBoard isDisable={false}/>} */}
        {success && (
          <div className='chessContainer p-5 xsm:p-2'>
            <div className='relative inline-block'>
              {isGameOver && (
                <GameOverPopUp className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
              )}
              <ChessBoard isDisable={isGameOver || (isOnline && turn!=mainPlayer)} />
            </div>
          </div>
        )}
      </div>
    );
  };
  return renderPage();
}
