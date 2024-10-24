import { useEffect, useRef } from 'react';
import useChessGameOffline from './useChessGameOffline';
import { resetAIMove, setMode, updateAIMove } from '../state/chess/chessSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import useCapturedPiecesAndScores from './useCapturedPiecesAndScores';
import { useDispatch } from 'react-redux';

export default function useAI() {
  const dispatch = useDispatch();
  const { handleBoardUpdateOnMove } = useChessGameOffline();
  const handleCapturedPiecesAndScores = useCapturedPiecesAndScores();
  const workerRef = useRef<Worker | null>(null);
  const { chess, aiMove, turn } = useSelector(
    (state: RootState) => state.chess
  );
  const { isGameOver } = useSelector((state: RootState) => state.gameStatus);
  const { mainPlayer } = useSelector((state: RootState) => state.players);
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../worker/calculateBestMove.ts', import.meta.url),
      { type: 'module' }
    );
    dispatch(setMode('ai'));
    workerRef.current.onmessage = (e: MessageEvent<string>) => {
      dispatch(updateAIMove(e.data));
    };
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
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
    if (!workerRef.current) return;
    if (turn !== mainPlayer) {
      workerRef.current?.postMessage({
        task: 'getBestMove',
        fen: chess.fen(),
        depth: 3,
      });
    }
  }, [turn, mainPlayer]);
}
