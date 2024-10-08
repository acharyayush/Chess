import { TiTick } from 'react-icons/ti';
import Button from './Button';
import { ImCross } from 'react-icons/im';
import { useEffect } from 'react';
interface RequestModalProps {
  onAccept: () => void;
  onReject: () => void;
  onRemove: () => void;
  requestText: string;
}
function RequestModal({
  onAccept,
  onReject,
  onRemove,
  requestText,
}: RequestModalProps) {
  //time is 5 sec for animation too.
  const handleRejection = () => {
    onReject();
    onRemove();
  };
  useEffect(() => {
    const timer = setTimeout(handleRejection, 5000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className='bg-slate-900 rounded-md flex justify-center items-center w-fit p-4 px-8 sm:px-4 fixed bottom-4 right-2 sm:top-2 sm:left-2 sm:bottom-auto sm:w-auto z-50 animate-slideIn sm:animate-none'>
      <div className='timeIndicator animate-fillToFull h-2 w-[0%] bg-white absolute top-0 left-0 rounded-tl-md rounded-tr-md'></div>
      <div className='requestText text-xl sm:text-lg text-white'>
        {requestText}
      </div>
      <div className='requestBtns ml-5 flex items-center sm:flex-col'>
        <Button
          onClick={onAccept}
          className='bg-gray-700 p-0 text-4xl rounded-md w-10 h-10 m-0 mr-2 sm:mr-0 sm:mb-2'
          noShadow
        >
          <TiTick className='m-auto' />
        </Button>
        <Button
          onClick={handleRejection}
          className='bg-gray-700 p-0 text-lg rounded-md w-10 h-10 m-0'
          noShadow
        >
          <ImCross className='m-auto' />
        </Button>
      </div>
    </div>
  );
}

export default RequestModal;
