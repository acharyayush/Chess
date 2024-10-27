import { Chess, Color, PieceSymbol, WHITE } from 'chess.js';
import { PieceTableKey } from '../pieceTables';
import pieceTables from '../pieceTables';
const piecesPoints: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};
//simple evaluation function based on netscore
const getPieceSquareScore = (
  type: PieceSymbol,
  color: Color,
  isEndGame: boolean,
  i: number,
  j: number
) => {
  let pieceTableKey = type as PieceTableKey;
  if (type == 'k' && isEndGame) {
    pieceTableKey = 'ke';
  }
  const pieceTable = pieceTables[pieceTableKey];
  if (color == WHITE) {
    return pieceTable[i][j];
  }
  return pieceTable[7 - i][7 - j];
};
const evaluate = (board: ReturnType<Chess['board']>) => {
  let totalScore = 0,
    materialScore = 0,
    pieceSquareScore = 0;
  for (let i = 0; i < 8; ++i) {
    for (let j = 0; j < 8; ++j) {
      if (!board[i][j] || board[i][j]?.type === 'k') continue;
      const { type, color } = board[i][j]!;
      if (color === WHITE) {
        materialScore += piecesPoints[type];
        pieceSquareScore += getPieceSquareScore(type, color, false, i, j);
      } else {
        materialScore -= piecesPoints[type];
        pieceSquareScore -= getPieceSquareScore(type, color, false, i, j);
      }
    }
  }
  totalScore = materialScore + pieceSquareScore;
  return totalScore;
};
const minimax = (
  chess: Chess,
  depth: number,
  maximizingPlayer: boolean,
  alpha: number,
  beta: number
) => {
  //white is maximizing player for us
  if (chess.isGameOver()) {
    if (chess.isDraw()) return 0;
    //one of the player is winner. Opponent is winner if its my turn
    return chess.turn() === WHITE ? -10000 : 10000;
  }
  if (depth === 0) return evaluate(chess.board());
  if (maximizingPlayer) {
    //try to maximize score
    let score = -Infinity;
    for (const move of chess.moves()) {
      chess.move(move);
      score = Math.max(
        score,
        minimax(chess, depth - 1, !maximizingPlayer, alpha, beta)
      );
      chess.undo();
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return score;
  }
  //try to minimize score
  let score = Infinity;
  for (const move of chess.moves()) {
    chess.move(move);
    score = Math.min(
      score,
      minimax(chess, depth - 1, !maximizingPlayer, alpha, beta)
    );
    chess.undo();
    beta = Math.min(beta, score);
    if (beta <= alpha) break;
  }
  return score;
};
const getBestMove = (fen: string, depth: number) => {
  const tempChess = new Chess(fen);
  //if there is only move then there is no need to search deeper inside that move
  if (tempChess.moves().length === 1) return tempChess.moves()[0];

  const maximizingPlayer = tempChess.turn() === WHITE;
  let bestMove = '';
  let bestScore = maximizingPlayer ? -Infinity : Infinity;
  for (const move of tempChess.moves()) {
    let score: number;
    tempChess.move(move);
    if (tempChess.isGameOver()) {
      if (tempChess.isDraw()) score = 0;
      //its ai turn and ai wins
      bestMove = move;
      tempChess.undo();
      return bestMove;
    } else
      score = minimax(
        tempChess,
        depth - 1,
        !maximizingPlayer,
        -Infinity,
        Infinity
      );
    tempChess.undo();
    if (maximizingPlayer && score > bestScore) {
      bestScore = score;
      bestMove = move;
    } else if (!maximizingPlayer && score < bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
};
onmessage = (e: MessageEvent<{ task: string; fen: string; depth: number }>) => {
  const { task, fen, depth } = e.data;
  if (task === 'getBestMove') {
    postMessage(getBestMove(fen, depth));
  }
};
