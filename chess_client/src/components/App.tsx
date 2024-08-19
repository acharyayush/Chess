import { JOIN_GAME } from '../constants';
import socket from '../socket';
import Button from './shared/Button';
export default function App() {
  return (
    <div className='bg-slate-400 flex min-w-screen min-h-screen justify-evenly items-center'>
      <div className='board md:hidden'>
        <img
          src='/images/chessboard.png'
          className='w-[500px] lg:w-[350px]'
          alt=''
        />
      </div>
      <div className='rightSide text-center'>
        <div className='heroText'>
          <h1
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
            className='text-5xl lg:text-4xl xsm:text-3xl font-bold leading-[60px] mb-8 text-white'
          >
            Play Chess Online <br /> and Offline!
          </h1>
        </div>
        <div className='flex flex-col'>
          <div className='onlinePlayBtn mb-4'>
            <Button
              onClick={() => {
                socket.emit(JOIN_GAME);
              }}
              navigateTo='/play/online'
              className='text-md w-[350px] xsm:py-6 xsm:w-[270px] lg:w-[320px] md:w-[350px]'
            >
              <h1 className='text-3xl lg:text-2xl'>Play Online</h1>
              <span className='font-normal xsm:hidden'>
                Join the global action
              </span>
            </Button>
          </div>
        </div>
        <div className='offlinePlayBtn'>
          <Button
            navigateTo='/play/offline/askName'
            className='bg-gray-500 text-md w-[350px] xsm:w-[270px]  xsm:py-6 lg:w-[320px] md:w-[350px]'
          >
            <h1 className='text-3xl lg:text-2xl'>Play Offline</h1>
            <span className='font-normal xsm:hidden'>
              Enjoy local games with friends
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
