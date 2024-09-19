import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { Move, PAWN, WHITE } from 'chess.js';
import { PieceSymbolExcludingKing } from '../types';
import { piecesPoints } from '../constants';
import {
  setCapturedPiecesByBlack,
  setCapturedPiecesByWhite,
  setWhiteNetScore,
} from '../state/players/playerSlice';
import { useDispatch } from 'react-redux';

export default function useCapturedPiecesAndScores() {
  const dispatch = useDispatch();
  const { whiteNetScore, capturedPiecesByWhite, capturedPiecesByBlack } =
    useSelector((state: RootState) => state.players);
  const { undo } = useSelector((state: RootState) => state.chess);
  const handleCapturedPiecesAndScores = (moveRes: Move, isUndo?: boolean) => {
    //if piece is promoted then handle points incremenet/decrement based on the player
    if (!moveRes.captured && !moveRes.promotion) return;
    let netScore = whiteNetScore;
    let capturedByWhite = capturedPiecesByWhite;
    let capturedByBlack = capturedPiecesByBlack;
    if (moveRes.promotion) {
      const promotedPiece = moveRes.promotion as PieceSymbolExcludingKing;
      if (moveRes.color == WHITE) {
        netScore = !undo
          ? netScore + piecesPoints[promotedPiece] - 1
          : netScore - piecesPoints[promotedPiece] + 1;
        capturedByBlack = {
          ...capturedByBlack,
          [PAWN]: !isUndo
            ? capturedPiecesByBlack[PAWN] + 1
            : capturedPiecesByBlack[PAWN] - 1,
        };
      } else {
        netScore = !undo
          ? netScore - piecesPoints[promotedPiece] + 1
          : netScore + piecesPoints[promotedPiece] - 1;
        capturedByWhite = {
          ...capturedByWhite,
          [PAWN]: !isUndo
            ? capturedPiecesByWhite[PAWN] + 1
            : capturedPiecesByWhite[PAWN] - 1,
        };
      }
    }
    //if the move captures a piece, update point and capturedPieces accordingly
    if (moveRes.captured) {
      const capturedPiece = moveRes.captured as PieceSymbolExcludingKing;
      const capturedPoint = piecesPoints[capturedPiece];
      if (moveRes.color == WHITE) {
        netScore = !isUndo
          ? netScore + capturedPoint
          : netScore - capturedPoint;
        capturedByWhite = {
          ...capturedByWhite,
          [capturedPiece]: !isUndo
            ? capturedPiecesByWhite[capturedPiece] + 1
            : capturedPiecesByWhite[capturedPiece] - 1,
        };
      } else {
        netScore = !isUndo
          ? netScore - capturedPoint
          : netScore + capturedPoint;
        capturedByBlack = {
          ...capturedByBlack,
          [capturedPiece]: !isUndo
            ? capturedPiecesByBlack[capturedPiece] + 1
            : capturedPiecesByBlack[capturedPiece] - 1,
        };
      }
    }
    dispatch(setWhiteNetScore(netScore));
    dispatch(
      setCapturedPiecesByWhite({ ...capturedPiecesByWhite, ...capturedByWhite })
    );
    dispatch(
      setCapturedPiecesByBlack({ ...capturedPiecesByBlack, ...capturedByBlack })
    );
  };
  return handleCapturedPiecesAndScores;
}
