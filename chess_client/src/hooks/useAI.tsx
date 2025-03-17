import { useEffect } from 'react';
import useChessGameOffline from './useChessGameOffline';
import {
  resetAIMove,
  setMode,
  setWorker,
  updateAIMove,
} from '../state/chess/chessSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import useCapturedPiecesAndScores from './useCapturedPiecesAndScores';
import { useDispatch } from 'react-redux';

export default function useAI() {
  const dispatch = useDispatch();
  const { handleBoardUpdateOnMove } = useChessGameOffline();
  const handleCapturedPiecesAndScores = useCapturedPiecesAndScores();
  const { chess, aiMove, turn, botDepth, worker } = useSelector(
    (state: RootState) => state.chess
  );
  const { isGameOver } = useSelector((state: RootState) => state.gameStatus);
  const { mainPlayer } = useSelector((state: RootState) => state.players);
  useEffect(() => {
    const firstWorker = new Worker(
      new URL('../worker/calculateBestMove.ts', import.meta.url),
      {
        type: 'module',
      }
    );
    firstWorker.onmessage = (e: MessageEvent<string>) => {
      dispatch(updateAIMove(e.data));
    };
    dispatch(setMode('ai'));
    dispatch(setWorker(firstWorker));
    return () => {
      if (worker) worker.terminate();
    };
  }, []);
  useEffect(() => {
    //if player has moved from one position to another, then attempt moving the move
    if (aiMove) {
      if (isGameOver) {
        dispatch(resetAIMove());
        return;
      }
      try {
        const moveRes = chess.move(aiMove);
        handleCapturedPiecesAndScores(moveRes);
        handleBoardUpdateOnMove(moveRes);
      } catch (e) {
        console.log('Invalid Move');
      } finally {
        dispatch(resetAIMove());
      }
    }
  }, [aiMove, isGameOver]);
  useEffect(() => {
    if (!worker) return;
    if (turn !== mainPlayer) {
      worker?.postMessage({
        task: 'getBestMove',
        fen: chess.fen(),
        depth: botDepth,
      });
    }
  }, [turn, mainPlayer, botDepth]);
}
