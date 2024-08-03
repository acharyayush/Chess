import Button from './shared/Button';

export default function App() {
  return (
    <div className='bg-slate-400 flex min-w-screen min-h-screen justify-evenly items-center'>
      <div className='board'>
        <img src='/images/chessboard.png' className='w-[500px]' alt='' />
      </div>
      <div className='rightSide text-center'>
        <div className='heroText'>
          <h1 style={{textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)"}} className='text-5xl font-bold leading-[60px] my-8 text-white'>
            Play Chess Online <br /> and Offline!
          </h1>
        </div>
        <div className='flex flex-col'>
          <div className='onlinePlayBtn mb-4'>
            <Button navigateTo='/play/online' className='text-md w-[350px]'>
              <h1 className='text-3xl'>Play Online</h1>
              <span className='font-normal'>Join the global action</span>
            </Button>
          </div>
        </div>
        <div className='offlinePlayBtn'>
          <Button navigateTo='/play/offline' className='bg-gray-500 text-md w-[350px]'>
            <h1 className='text-3xl'>Play Offline</h1>
            <span className='font-normal'>Enjoy local games with friends</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
