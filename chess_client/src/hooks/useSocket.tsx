import { useEffect, useState } from 'react';
import socket from '../socket';
import {
  GAMEOVER,
  INIT_GAME,
  RECEIVE_FEN,
  RECEIVE_MOVE_HISTORY,
  RECEIVE_PLAYER_DETAILS,
  RECEIVE_CAPTURED_DETAILS,
  RECEIVE_TIME,
  RECEIVE_LATEST_MOVE,
  REQUEST_REMATCH,
  REJECT_REMATCH,
} from '../events';
import { Color, WHITE } from 'chess.js';
import {
  resetPlayers,
  setBlackTime,
  setCapturedPiecesByBlack,
  setCapturedPiecesByWhite,
  setMainPlayer,
  setPlayers,
  setTotalTime,
  setWhiteNetScore,
  setWhiteTime,
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
  setPrevMove,
  setFlag,
} from '../state/chess/chessSlice';
import useSound from './useSound';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import {
  resetGameStatus,
  setGameOverDescription,
  setHasRejectedRematch,
  setIsCheck,
  setIsDraw,
  setIsGameOver,
  setShowRematchRequest,
  setWinner,
} from '../state/gameStatus/gameStatusSlice';
import { CapturedDetails, INIT_GAME_TYPE, Move, Winner } from '../types';
import useTimer from './useTimer';
import useCapturedPiecesAndScores from './useCapturedPiecesAndScores';
import showToast from '../utils/toast';
interface GameOverProps {
  gameOverDescription: string;
  winnerColor: Winner;
}
export default function useSocket() {
  const { handleSoundEffects } = useSound();
  const [success, setSuccess] = useState(false);
  const { chess, move, fen, flag } = useSelector(
    (state: RootState) => state.chess
  );
  const { isGameOver, hasRejectedRematch } = useSelector(
    (state: RootState) => state.gameStatus
  );
  const { whiteTime, blackTime, player1, player2, mainPlayer } = useSelector(
    (state: RootState) => state.players
  );
  const handleCapturedPiecesAndScores = useCapturedPiecesAndScores();
  const dispatch = useDispatch();

  const {
    time: whiteTimeInTimer,
    startTimer: startWhiteTimer,
    pauseTimer: pauseWhiteTimer,
    resetTimer: resetWhiteTimer,
  } = useTimer();
  const {
    time: blackTimeInTimer,
    startTimer: startBlackTimer,
    pauseTimer: pauseBlackTimer,
    resetTimer: resetBlackTimer,
  } = useTimer();
  const resetGame = () => {
    dispatch(resetChess());
    dispatch(resetPlayers());
    dispatch(resetGameStatus());
  };
  const resetTimers = (time: number) => {
    resetWhiteTimer(time);
    resetBlackTimer(time);
  };
  const pauseTimers = () => {
    pauseWhiteTimer();
    pauseBlackTimer();
  };
  const toggleTimerBasedOnTurn = (turn: Color) => {
    if (isGameOver) return;
    if (turn === WHITE) {
      pauseBlackTimer();
      startWhiteTimer(whiteTime);
    } else {
      pauseWhiteTimer();
      startBlackTimer(blackTime);
    }
  };
  useEffect(() => {
    dispatch(setIsOnline(true));
    socket.on(INIT_GAME, ({ mainPlayer, fen, totalTime }: INIT_GAME_TYPE) => {
      resetGame();
      chess.load(fen);
      dispatch(setFen(fen));
      dispatch(setMainPlayer(mainPlayer));
      dispatch(setBoard(chess.board()));
      dispatch(setTotalTime(totalTime));
      setSuccess(true);
      resetTimers(totalTime);
      startWhiteTimer();
    });
    socket.on(
      RECEIVE_PLAYER_DETAILS,
      ({ player1, player2 }: { player1: string; player2: string }) => {
        dispatch(setPlayers({ player1, player2 }));
      }
    );
    socket.on(RECEIVE_FEN, ({ fen, flag }: { fen: string; flag: string }) => {
      dispatch(setFen(fen));
      dispatch(setFlag(flag));
      return;
    });
    socket.on(RECEIVE_LATEST_MOVE, (move: Move) => {
      dispatch(setPrevMove(move));
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
        pauseTimers();
      }
    );
    socket.on(RECEIVE_CAPTURED_DETAILS, (capturedDetails: CapturedDetails) => {
      dispatch(setWhiteNetScore(capturedDetails.whiteNetScore));
      dispatch(setCapturedPiecesByWhite(capturedDetails.capturedPiecesByWhite));
      dispatch(setCapturedPiecesByBlack(capturedDetails.capturedPiecesByBlack));
    });
    socket.on(
      RECEIVE_TIME,
      (timeLeft: { player1?: number; player2?: number }) => {
        if (timeLeft.player1 != undefined) {
          dispatch(setWhiteTime(timeLeft.player1));
        }
        if (timeLeft.player2 != undefined) {
          dispatch(setBlackTime(timeLeft.player2));
        }
      }
    );
    socket.on(REQUEST_REMATCH, () => {
      dispatch(setShowRematchRequest(true));
    });
    socket.on(REJECT_REMATCH, () => {
      dispatch(setHasRejectedRematch(true));
    });
    return () => {
      socket.off(INIT_GAME);
      socket.off(RECEIVE_FEN);
      socket.off(RECEIVE_MOVE_HISTORY);
      socket.off(RECEIVE_PLAYER_DETAILS);
      socket.off(GAMEOVER);
      socket.off(RECEIVE_CAPTURED_DETAILS);
      socket.off(RECEIVE_TIME);
      socket.off(RECEIVE_LATEST_MOVE);
      socket.off(REQUEST_REMATCH);
    };
  }, []);
  useEffect(() => {
    if (move.from && move.to) {
      try {
        const moveRes = chess.move(move);
        handleCapturedPiecesAndScores(moveRes);
        dispatch(setFen(chess.fen()));
        dispatch(setFlag(moveRes.flags));
        dispatch(setPrevMove({ from: moveRes.from, to: moveRes.to }));
      } catch (e) {
        console.log('Invalid Move');
      } finally {
        dispatch(resetMove());
      }
    }
  }, [move]);
  useEffect(() => {
    if (!flag) return;
    chess.load(fen);
    if (chess.isCheck()) dispatch(setIsCheck(true));
    else dispatch(setIsCheck(false));
    dispatch(setBoard(chess.board()));
    dispatch(toggleTurn());
    dispatch(resetMove());
    handleSoundEffects(flag, chess.inCheck(), chess.isGameOver());
    toggleTimerBasedOnTurn(chess.turn());
    dispatch(setFlag(flag));
  }, [fen, flag]);
  useEffect(() => {
    if (hasRejectedRematch === true) {
      showToast(
        'error',
        `${mainPlayer === WHITE ? player2 : player1} rejected your rematch request!`
      );
      dispatch(setHasRejectedRematch(false));
    }
  }, [player1, player2, hasRejectedRematch]);
  useEffect(() => {
    dispatch(setWhiteTime(whiteTimeInTimer));
  }, [whiteTimeInTimer]);
  useEffect(() => {
    dispatch(setBlackTime(blackTimeInTimer));
  }, [blackTimeInTimer]);
  return { success };
}
