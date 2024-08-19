import { BLACK, Move, WHITE } from 'chess.js';
import { useEffect } from 'react';
import { PieceSymbolExcludingKing } from '../types';
import { piecesPoints } from '../constants';
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
  setWhiteNetScore,
  setCapturedPiecesByWhite,
  setCapturedPiecesByBlack,
  resetPlayers,
  setPlayers,
} from '../state/players/playerSlice';

import { useDispatch } from 'react-redux';
import useSound from './useSound';

export default function useChessGame() {
  const { chess, move, undo } = useSelector((state: RootState) => state.chess);
  const { hasResigned, rematch } = useSelector(
    (state: RootState) => state.gameStatus
  );
  const {player1, player2, whiteNetScore, capturedPiecesByWhite, capturedPiecesByBlack } =
    useSelector((state: RootState) => state.players);
  const {handleSoundEffects} = useSound()
  const dispatch = useDispatch();
  const getWinner = () => {
    return chess.turn() == BLACK ? WHITE : BLACK;
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

  const handleBoardUpdateOnMove = (moveRes: Move) => {
    dispatch(setMoveHistory(chess.history()));
    dispatch(setBoard(chess.board()));
    dispatch(setTurn(chess.turn()));
    handleSoundEffects(moveRes.flags, chess.inCheck());
    if (chess.inCheck()) {
      dispatch(setIsCheck(true));
    } else {
      dispatch(setIsCheck(false));
    }
    gameOverChecks();
  };

  const handleCapturedPiecesAndScores = (moveRes: Move, isUndo?: boolean) => {
    if (moveRes.promotion) {
      let promotedPiece = moveRes.promotion as PieceSymbolExcludingKing;
      if (moveRes.color == WHITE) {
        dispatch(
          setWhiteNetScore(
            !undo
              ? whiteNetScore + piecesPoints[promotedPiece] - 1
              : whiteNetScore - piecesPoints[promotedPiece] + 1
          )
        );
      } else {
        dispatch(
          setWhiteNetScore(
            !undo
              ? whiteNetScore - piecesPoints[promotedPiece] + 1
              : whiteNetScore + piecesPoints[promotedPiece] - 1
          )
        );
      }
    }
    if (moveRes.captured) {
      let capturedPiece = moveRes.captured as PieceSymbolExcludingKing;
      let capturedPoint = piecesPoints[capturedPiece];
      if (moveRes.color == WHITE) {
        dispatch(
          setWhiteNetScore(
            !isUndo
              ? whiteNetScore + capturedPoint
              : whiteNetScore - capturedPoint
          )
        );
        dispatch(
          setCapturedPiecesByWhite({
            ...capturedPiecesByWhite,
            [capturedPiece]: !isUndo
              ? capturedPiecesByWhite[capturedPiece] + 1
              : capturedPiecesByWhite[capturedPiece] - 1,
          })
        );
      } else {
        dispatch(
          setWhiteNetScore(
            !isUndo
              ? whiteNetScore - capturedPoint
              : whiteNetScore + capturedPoint
          )
        );
        dispatch(
          setCapturedPiecesByBlack({
            ...capturedPiecesByBlack,
            [capturedPiece]: !isUndo
              ? capturedPiecesByBlack[capturedPiece] + 1
              : capturedPiecesByBlack[capturedPiece] - 1,
          })
        );
      }
    }
  };
  useEffect(()=>{
    dispatch(setBoard(chess.board()))
  }, [])
  useEffect(() => {
    if (!undo) return;
    let moveRes = chess.undo();
    if (!moveRes) return;
    handleCapturedPiecesAndScores(moveRes, true);
    handleBoardUpdateOnMove(moveRes);
    dispatch(setLegalMoves([]));
    dispatch(resetMove());
    dispatch(setUndo(false));
  }, [undo]);
  useEffect(() => {
    //if player has moved from one position to another, then attempt moving the move
    if (move.from && move.to) {
      try {
        let moveRes = chess.move(move);
        handleCapturedPiecesAndScores(moveRes);
        handleBoardUpdateOnMove(moveRes);
      } catch (e) {
        console.log('Invalid Move');
      } finally {
        dispatch(resetMove());
      }
    }
  }, [move]);
  useEffect(() => {
    if(!rematch) return
    dispatch(resetChess());
    dispatch(resetPlayers());
    dispatch(resetGameStatus());
    if(player1=="White" || player2=="Black") return
    dispatch(setPlayers({player1: player2, player2: player1}))
  }, [rematch]);
  useEffect(() => {
    if (!hasResigned) return;
    gameOverChecks();
    dispatch(setHasResigned(false));
  }, [hasResigned]);
}
