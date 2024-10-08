import { useState } from 'react';
import Button from './shared/Button';
import { useDispatch } from 'react-redux';
import { setPlayers } from '../state/players/playerSlice';
import showToast from '../utils/toast';
import { useNavigate } from 'react-router-dom';
export default function AskNameForTwoPlayer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialDetail = {
    player1: '',
    player2: '',
  };
  const [detail, setDetail] = useState(initialDetail);
  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetail((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    if (!detail.player1 || !detail.player2) {
      showToast('error', 'Please, enter name of both players!');
    } else if (detail.player1 === detail.player2) {
      showToast('error', 'Names of both players must not be same!');
    } else {
      dispatch(setPlayers(detail));
      navigate('/play/offline');
    }
  };
  return (
    <div className='menuContainer grid place-content-center h-screen'>
      <form className='menu w-[350px] xsm:w-[270px] shadow-xl p-4 py-8 xsm:p-0 xsm:shadow-none'>
        <div className='player1 mb-6'>
          <label htmlFor='player1' className='font-bold text-lg text-gray-500'>
            Player 1
          </label>
          <br />
          <input
            type='text'
            required
            autoComplete='off'
            id='player1'
            name='player1'
            className='mt-1 outline-none border-2 border-blue-500 text-center bg-[#fff] rounded-md text-[1.05rem] p-2 w-full'
            placeholder='Enter name of player 1'
            onChange={handleDetailChange}
          />
        </div>
        <div className='player2 mb-6'>
          <label htmlFor='player2' className='font-bold text-lg text-gray-500'>
            Player 2
          </label>
          <br />
          <input
            type='text'
            required
            autoComplete='off'
            id='player2'
            name='player2'
            className='mt-1 outline-none border-2 border-blue-500 text-center bg-[#fff] rounded-md text-[1.05rem] p-2 w-full'
            placeholder='Enter name of player 2'
            onChange={handleDetailChange}
          />
        </div>
        <div className='text-center'>
          <Button className='text-xl py-3 px-8' onClick={handleSubmit}>
            Let's go
          </Button>
        </div>
      </form>
    </div>
  );
}
