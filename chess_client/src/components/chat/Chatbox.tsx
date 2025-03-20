import { useEffect, useRef, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';
import { RootState } from '../../state/store';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../state/message/messageSlice';
import socket from '../../socket';
import { SEND_MESSAGE } from '../../events';
interface ChatboxProps {
  className?: string;
}
function Chatbox({ className }: ChatboxProps) {
  const [message, setMessage] = useState('');
  const messageContentContainerRef = useRef<HTMLDivElement>(null);
  const { messages } = useSelector((state: RootState) => state.messages);
  const dispatch = useDispatch();
  const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;
    dispatch(addMessage({ source: 'Me', message }));
    socket.emit(SEND_MESSAGE, message);
    setMessage('');
  };
  useEffect(() => {
    console.log('inside message');
    if (messageContentContainerRef.current) {
      messageContentContainerRef.current.scrollTop =
        messageContentContainerRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div
      className={twMerge(
        'Chatbox h-[250px] flex flex-col p-4 border-t-2 border-b-2 border-gray-700/40',
        className
      )}
    >
      <h1 className='text-xl font-bold mb-2'>Chat with your opponent...</h1>
      <div
        ref={messageContentContainerRef}
        className='Content h-[135px] overflow-y-auto scrollbar-hide scroll-smooth'
      >
        {messages.map(({ source, message }) => (
          <div className='messageContainer flex'>
            <span
              className={source == 'Me' ? `text-blue-300` : `text-green-300`}
            >
              {source}:
            </span>
            <div className='message ml-2'> {message}</div>
          </div>
        ))}
      </div>
      <form
        className='TextInput h-9 flex mt-auto'
        onSubmit={handleMessageSubmit}
      >
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type your message...'
          className='pl-2 grow h-full rounded-md bg-transparent outline-none border-gray-400 border-2 '
        />
        <button>
          <IoMdSend className='text-2xl w-12' />
        </button>
      </form>
    </div>
  );
}

export default Chatbox;
