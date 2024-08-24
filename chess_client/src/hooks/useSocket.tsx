import { useEffect, useState } from 'react';
import socket from '../socket';
import {
  GAMEOVER,
  INIT_GAME,
  RECEIVE_FEN,
  RECEIVE_MOVE_HISTORY,
  RECEIVE_PLAYER_DETAILS,
  RECEIVE_CAPTURED_DETAILS,
} from '../events';
import { Chess, Color } from 'chess.js';
import {
  resetPlayers,
  setCapturedPiecesByBlack,
  setCapturedPiecesByWhite,
  setMainPlayer,
  setPlayers,
  setWhiteNetScore,
} from '../state/players/playerSlice';
import { useDispatch } from 'react-redux';
import {
  setBoard,
  setFen,
  setIsOnline,
  setMoveHistory,
  toggleTurn,
  resetMove,
  resetChess,
} from '../state/chess/chessSlice';
import useSound from './useSound';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import {
  resetGameStatus,
  setGameOverDescription,
  setIsCheck,
  setIsDraw,
  setIsGameOver,
  setWinner,
} from '../state/gameStatus/gameStatusSlice';
import { CapturedDetails, Winner } from '../types';
interface GameOverProps {
  gameOverDescription: string;
  winnerColor: Winner;
}
export default function useSocket() {
  const { handleSoundEffects } = useSound();
  const [success, setSuccess] = useState(false);
  const { isCheck } = useSelector((state: RootState) => state.gameStatus);
  const dispatch = useDispatch();
  const resetGame = () => {
    dispatch(resetChess());
    dispatch(resetPlayers());
    dispatch(resetGameStatus());
  };
  useEffect(() => {
    dispatch(setIsOnline(true));
    socket.on(
      INIT_GAME,
      ({ mainPlayer, fen }: { mainPlayer: Color; fen: string }) => {
        resetGame();
        const tempChess = new Chess(fen);
        dispatch(setFen(fen));
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
      dispatch(setFen(fen));
      dispatch(toggleTurn());
      dispatch(resetMove());
      handleSoundEffects(flag, isCheck);
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
    socket.on(RECEIVE_CAPTURED_DETAILS, (capturedDetails: CapturedDetails) => {
      dispatch(setWhiteNetScore(capturedDetails.whiteNetScore));
      dispatch(setCapturedPiecesByWhite(capturedDetails.capturedPiecesByWhite));
      dispatch(setCapturedPiecesByBlack(capturedDetails.capturedPiecesByBlack));
    });

    return () => {
      socket.off(INIT_GAME);
      socket.off(RECEIVE_FEN);
      socket.off(RECEIVE_MOVE_HISTORY);
      socket.off(RECEIVE_PLAYER_DETAILS);
      socket.off(GAMEOVER);
      socket.off(RECEIVE_CAPTURED_DETAILS);
    };
  }, []);
  return { success };
}
