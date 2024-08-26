import { BLACK, Chess, Color, WHITE, Move as MoveRes, PAWN } from 'chess.js';
import {
  CapturedDetails,
  Move,
  PieceSymbolExcludingKing,
  Player,
} from './types';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { piecesPoints } from './constants';
export default class Game {
  // PLAYER 1 IS ALWAYS WHITE AND PLAYER 2 IS ALWAYS BLACK
  private chess: Chess;
  player1: Player;
  player2: Player;
  roomId: string;
  rematchStatus: { player1: boolean; player2: boolean };
  gameOverDetails: {
    gameOverDescription: string;
    winnerColor: Color | 'd';
  };
  capturedDetails: CapturedDetails;
  private initialCapturedDetails: CapturedDetails = {
    whiteNetScore: 0,
    capturedPiecesByWhite: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    capturedPiecesByBlack: { p: 0, n: 0, b: 0, r: 0, q: 0 },
  };

  constructor(player1: Player, player2: Player) {
    this.player1 = player1;
    this.player2 = player2;
    //for testing rnbqkbnr/ppppp2p/8/5pp1/4PP2/8/PPPP2PP/RNBQKBNR w KQkq - 0 1
    this.chess = new Chess();
    this.roomId = uuidv4();
    this.player1.socket.join(this.roomId);
    this.player2.socket.join(this.roomId);
    this.rematchStatus = { player1: false, player2: false };
    this.gameOverDetails = {
      gameOverDescription: '',
      winnerColor: 'd',
    };
    this.capturedDetails = this.initialCapturedDetails;
  }
  //methods
  private getPlayerColor(id: string) {
    return id === this.player1.socket.id ? WHITE : BLACK;
  }
  getMoveHistory() {
    return this.chess.history();
  }
  getTurn(): Player {
    return this.chess.turn() === WHITE ? this.player1 : this.player2;
  }
  getFen() {
    return this.chess.fen();
  }
  getOpponent(player: Player) {
    return player == this.player1 ? this.player2 : this.player1;
  }
  isGameOver = () => {
    if (!this.chess.isGameOver()) return false;
    if (this.chess.isCheckmate()) {
      this.gameOverDetails = {
        ...this.gameOverDetails,
        gameOverDescription: 'checkmate',
        winnerColor: this.chess.turn() == WHITE ? BLACK : WHITE,
      };
    } else if (this.chess.isDraw()) {
      //the draw can be by three fold repetition or insufficient material or stalemate or 50 move rule
      let gameOverDescription: string;
      if (this.chess.isThreefoldRepetition())
        gameOverDescription = 'repetition';
      else if (this.chess.isStalemate()) gameOverDescription = 'stalemate';
      else if (this.chess.isInsufficientMaterial())
        gameOverDescription = 'insufficient material';
      else gameOverDescription = '50 move rule';
      this.gameOverDetails = {
        ...this.gameOverDetails,
        gameOverDescription,
        winnerColor: 'd',
      };
    }
    return true;
  };
  //if player is making move on his turn then update chess by making move
  makeMove(player: Socket, move: Move) {
    try {
      const playerColor = this.getPlayerColor(player.id);
      if (playerColor != this.chess.turn()) return;
      return this.chess.move(move);
    } catch (e) {
      throw e;
    }
  }
  handleResetForRematch(socket: Socket) {
    //reset only if both players are requesting to rematch
    if (!this.rematchStatus.player1 && socket.id === this.player1.socket.id) {
      this.rematchStatus.player1 = true;
    }
    if (!this.rematchStatus.player2 && socket.id === this.player2.socket.id) {
      this.rematchStatus.player2 = true;
    }
    if (!this.rematchStatus.player1 || !this.rematchStatus.player2)
      return false;

    this.chess = new Chess();
    //swapping player color after rematch
    const temp = this.player1;
    this.player1 = this.player2;
    this.player2 = temp;
    this.rematchStatus = { player1: false, player2: false };
    return true;
  }
  handleCapturedPiecesAndScores(moveRes: MoveRes) {
    //if piece is promoted then handle points incremenet/decrement based on the player
    if (!moveRes.captured && !moveRes.promotion) return false;
    if (moveRes.promotion) {
      const promotedPiece = moveRes.promotion as PieceSymbolExcludingKing;
      if (moveRes.color == WHITE) {
        this.capturedDetails.whiteNetScore += piecesPoints[promotedPiece] - 1;
        this.capturedDetails.capturedPiecesByBlack[PAWN] += 1;
      } else {
        this.capturedDetails.whiteNetScore =
          this.capturedDetails.whiteNetScore - piecesPoints[promotedPiece] + 1;
        this.capturedDetails.capturedPiecesByWhite[PAWN] += 1;
      }
    }
    //if the move captures a piece, update point and capturedPieces accordingly
    if (moveRes.captured) {
      const capturedPiece = moveRes.captured as PieceSymbolExcludingKing;
      const capturedPoint = piecesPoints[capturedPiece];
      if (moveRes.color == WHITE) {
        this.capturedDetails.whiteNetScore += capturedPoint;
        this.capturedDetails.capturedPiecesByWhite[capturedPiece] += 1;
      } else {
        this.capturedDetails.whiteNetScore -= capturedPoint;
        this.capturedDetails.capturedPiecesByBlack[capturedPiece] += 1;
      }
    }
    return true;
  }
}
