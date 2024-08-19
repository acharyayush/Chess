import { useEffect, useState } from 'react';
import socket from '../socket';
import { INIT_GAME, RECEIVE_MOVE } from '../constants';
import { Color } from 'chess.js';
import { setMainPlayer } from '../state/players/playerSlice';
import { useDispatch } from 'react-redux';
import { setIsOnline, setMove } from '../state/chess/chessSlice';
export default function useSocket() {
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setIsOnline(true));
    socket.on(INIT_GAME, ({ mainPlayer }: { mainPlayer: Color }) => {
      dispatch(setMainPlayer(mainPlayer));
      setSuccess(true);
    });
    socket.on(RECEIVE_MOVE, (move) => {
      dispatch(setMove(move));
      return;
    });
    return () => {
      socket.off(INIT_GAME);
      socket.off(RECEIVE_MOVE);
    };
  }, []);
  return { success };
}
