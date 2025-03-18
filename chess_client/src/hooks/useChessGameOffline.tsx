import { BLACK, Color, Move, WHITE } from 'chess.js';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';

import {
  setMoveHistory,
  setBoard,
  setTurn,
  setLegalMoves,
  setUndo,
  resetMove,
  resetChess,
  setPrevMove,
  setMode,
  setWorker,
  updateAIMove,
} from '../state/chess/chessSlice';
import {
  setWinner,
  setIsDraw,
  setIsGameOver,
  setHasResigned,
  setGameOverDescription,
  resetGameStatus,
  setIsCheck,
} from '../state/gameStatus/gameStatusSlice';
import {
  resetPlayers,
  setPlayers,
  setMainPlayer,
  setTotalTime,
  setWhiteTime,
  setBlackTime,
  setPlayersLogoUrl,
} from '../state/players/playerSlice';

import { useDispatch } from 'react-redux';
import useSound from './useSound';
import useTimer from './useTimer';
import useCapturedPiecesAndScores from './useCapturedPiecesAndScores';

export default function useChessGameOffline() {
  const { chess, turn, move, undo, enableTimer, mode, worker } = useSelector(
    (state: RootState) => state.chess
  );
  const { hasResigned, rematch, isGameOver } = useSelector(
    (state: RootState) => state.gameStatus
  );
  const { player1, player2, player1LogoUrl, player2LogoUrl, mainPlayer } =
    useSelector((state: RootState) => state.players);
  const [totalTimeOffline] = useState(10 * 60);
  const { handleSoundEffects } = useSound();
  const handleCapturedPiecesAndScores = useCapturedPiecesAndScores();
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
  const dispatch = useDispatch();
  const getWinner = () => {
    return chess.turn() == BLACK ? WHITE : BLACK;
  };
  const getOpponent = (player: Color) => {
    return player === WHITE ? BLACK : WHITE;
  };
  const pauseTimers = () => {
    pauseWhiteTimer();
    pauseBlackTimer();
  };
  const resetTimers = (time: number) => {
    resetWhiteTimer(time);
    resetBlackTimer(time);
  };
  const toggleTimerBasedOnTurn = () => {
    if (isGameOver) return;
    if (chess.turn() == WHITE) {
      pauseBlackTimer();
      startWhiteTimer();
    } else {
      pauseWhiteTimer();
      startBlackTimer();
    }
  };
  //check if the game is over and update the status based on its result
  const gameOverChecks = () => {
    if (!chess.isGameOver() && !hasResigned) return;
    dispatch(setIsGameOver(true));
    if (hasResigned || chess.isCheckmate()) {
      if (hasResigned) dispatch(setGameOverDescription('resignation'));
      else dispatch(setGameOverDescription('checkmate'));
      dispatch(setWinner(getWinner()));
      return;
    }
    if (chess.isDraw()) {
      //the draw can be by three fold repetition or insufficient material or stalemate or 50 move rule
      if (chess.isThreefoldRepetition())
        dispatch(setGameOverDescription('repetition'));
      else if (chess.isStalemate())
        dispatch(setGameOverDescription('stalemate'));
      else if (chess.isInsufficientMaterial())
        dispatch(setGameOverDescription('insufficient material'));
      else dispatch(setGameOverDescription('50 move rule'));
      dispatch(setIsDraw(true));
      dispatch(setWinner('d'));
      return;
    }
  };
  const resetGame = () => {
    dispatch(resetChess());
    dispatch(resetPlayers());
    dispatch(resetGameStatus());
  };
  const handleBoardUpdateOnMove = (moveRes: Move) => {
    const history = chess.history({ verbose: true });
    const latestMove =
      history.length == 0 ? { from: '', to: '' } : history[history.length - 1];
    dispatch(setPrevMove({ from: latestMove.from, to: latestMove.to }));
    dispatch(setMoveHistory(chess.history()));
    dispatch(setBoard(chess.board()));
    dispatch(setTurn(chess.turn()));
    handleSoundEffects(moveRes.flags, chess.inCheck(), chess.isGameOver());
    if (chess.inCheck()) {
      dispatch(setIsCheck(true));
    } else {
      dispatch(setIsCheck(false));
    }
    gameOverChecks();
  };
  useEffect(() => {
    resetGame();
    dispatch(setMode('offline'));
  }, []);
  useEffect(() => {
    if (!undo) return;
    const performUndo = () => {
      const moveRes = chess.undo();
      if (!moveRes) return;
      handleCapturedPiecesAndScores(moveRes, true);
      handleBoardUpdateOnMove(moveRes);
      dispatch(setLegalMoves([]));
      dispatch(resetMove());
      dispatch(setUndo(false));
      if (enableTimer) toggleTimerBasedOnTurn();
    };
    if (mode == 'ai') {
      //if ai is still calculating and user perform undo, then undo once, else undo twice
      if (turn == BLACK) {
        performUndo();
        //terminate the worker (pause calculating best move and free up the worker) and create new worker
        if (worker) {
          worker.terminate();
          const newWorker = new Worker(
            new URL('../worker/calculateBestMove.ts', import.meta.url),
            {
              type: 'module',
            }
          );
          newWorker.onmessage = (e: MessageEvent<string>) => {
            dispatch(updateAIMove(e.data));
          };
          dispatch(setWorker(newWorker));
        }
      } else {
        performUndo();
        performUndo();
      }
    } else {
      performUndo();
    }
  }, [undo, enableTimer, turn, mode, worker]);
  useEffect(() => {
    //if player has moved from one position to another, then attempt moving the move
    if (move.from && move.to) {
      try {
        const moveRes = chess.move(move);
        handleCapturedPiecesAndScores(moveRes);
        handleBoardUpdateOnMove(moveRes);
        if (enableTimer) toggleTimerBasedOnTurn();
      } catch (e) {
        console.log('Invalid Move');
      } finally {
        dispatch(resetMove());
      }
    }
  }, [move]);
  useEffect(() => {
    if (!rematch) return;
    resetGame();
    dispatch(setTotalTime(totalTimeOffline));
    resetTimers(totalTimeOffline);
    startWhiteTimer();
    if (mode == 'ai') return;
    dispatch(setMainPlayer(getOpponent(mainPlayer)));
    //if player 1 or 2 name is either white or black then leave as it is, else set the name
    if (player1 == 'White' || player2 == 'Black') return;
    dispatch(setPlayers({ player1: player2, player2: player1 }));
    dispatch(
      setPlayersLogoUrl({
        player1LogoUrl: player2LogoUrl,
        player2LogoUrl: player1LogoUrl,
      })
    );
  }, [rematch, player1, player2, player1LogoUrl, player2LogoUrl]);
  useEffect(() => {
    if (!hasResigned) return;
    gameOverChecks();
    dispatch(setHasResigned(false));
  }, [hasResigned]);
  useEffect(() => {
    if (isGameOver) pauseTimers();
  }, [isGameOver]);
  //timer
  useEffect(() => {
    if (enableTimer && !isGameOver) {
      if (turn == WHITE) startWhiteTimer();
      else startBlackTimer();
      dispatch(setTotalTime(totalTimeOffline));
    }
    return () => {
      resetTimers(totalTimeOffline);
    };
  }, [enableTimer]);
  useEffect(() => {
    dispatch(setWhiteTime(whiteTimeInTimer));
    if (whiteTimeInTimer <= 0) {
      dispatch(setIsGameOver(true));
      dispatch(setWinner(BLACK));
      dispatch(setGameOverDescription('Timeout'));
    }
  }, [whiteTimeInTimer]);
  useEffect(() => {
    dispatch(setBlackTime(blackTimeInTimer));
    if (blackTimeInTimer <= 0) {
      dispatch(setIsGameOver(true));
      dispatch(setWinner(WHITE));
      dispatch(setGameOverDescription('Timeout'));
    }
  }, [blackTimeInTimer]);
  return { handleBoardUpdateOnMove };
}
