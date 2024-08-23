import { useEffect, useState } from 'react';
import socket from '../socket';
import {
  GAMEOVER,
  INIT_GAME,
  RECEIVE_FEN,
  RECEIVE_MOVE_HISTORY,
  RECEIVE_PLAYER_DETAILS,
} from '../constants/events';
import { Chess, Color } from 'chess.js';
import { setMainPlayer, setPlayers } from '../state/players/playerSlice';
import { useDispatch } from 'react-redux';
import {
  setBoard,
  setFen,
  setIsOnline,
  setMoveHistory,
  toggleTurn,
  resetMove,
} from '../state/chess/chessSlice';
import useSound from './useSound';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import {
  setGameOverDescription,
  setIsCheck,
  setIsDraw,
  setIsGameOver,
  setWinner,
} from '../state/gameStatus/gameStatusSlice';
import { Winner } from '../types';
interface GameOverProps {
  gameOverDescription: string;
  winnerColor: Winner;
}
export default function useSocket() {
  const { handleSoundEffects } = useSound();
  const [success, setSuccess] = useState(false);
  const { isCheck } = useSelector((state: RootState) => state.gameStatus);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setIsOnline(true));
    socket.on(
      INIT_GAME,
      ({ mainPlayer, fen }: { mainPlayer: Color; fen: string }) => {
        const tempChess = new Chess(fen);
        dispatch(setMainPlayer(mainPlayer));
        dispatch(setBoard(tempChess.board()));
        setSuccess(true);
      }
    );
    socket.on(
      RECEIVE_PLAYER_DETAILS,
      ({ player1, player2 }: { player1: string; player2: string }) => {
        dispatch(setPlayers({ player1, player2 }));
      }
    );
    socket.on(RECEIVE_FEN, ({ fen, flag }: { fen: string; flag: string }) => {
      const tempChess = new Chess(fen);
      if (tempChess.isCheck()) dispatch(setIsCheck(true));
      else dispatch(setIsCheck(false));
      dispatch(setBoard(tempChess.board()));
      handleSoundEffects(flag, isCheck);
      dispatch(setFen(fen));
      dispatch(toggleTurn());
      dispatch(resetMove());
      return;
    });
    socket.on(RECEIVE_MOVE_HISTORY, (MoveHistory) => {
      dispatch(setMoveHistory(MoveHistory));
    });
    socket.on(
      GAMEOVER,
      ({ winnerColor, gameOverDescription }: GameOverProps) => {
        dispatch(setIsGameOver(true));
        if (winnerColor == 'd') {
          //this is draw
          dispatch(setIsDraw(true));
        }
        dispatch(setWinner(winnerColor));
        dispatch(setGameOverDescription(gameOverDescription));
      }
    );
    return () => {
      socket.off(INIT_GAME);
      socket.off(RECEIVE_FEN);
      socket.off(RECEIVE_MOVE_HISTORY);
      socket.off(RECEIVE_PLAYER_DETAILS);
      socket.off(GAMEOVER);
    };
  }, []);
  return { success };
}
