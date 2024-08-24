import { BLACK, Chess, Color, WHITE } from 'chess.js';
import { Move, Player } from './types';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
export default class Game {
  private player1: Player;
  private player2: Player;
  private chess: Chess;
  private roomId: string;
  private rematchStatus: { player1: boolean; player2: boolean };
  private gameOverDetails: {
    gameOverDescription: string;
    winnerColor: Color | 'd';
  };
  // player 1 is always white amd player 2 is always black
  constructor(player1: Player, player2: Player) {
    this.player1 = player1;
    this.player2 = player2;
    //for testing rnbqkbnr/ppppp2p/8/5pp1/4PP2/8/PPPP2PP/RNBQKBNR w KQkq - 0 1
    this.chess = new Chess('rnbqkbnr/ppppp2p/8/5pp1/4PP2/8/PPPP2PP/RNBQKBNR w KQkq - 0 1');
    this.roomId = uuidv4();
    this.player1.socket.join(this.roomId);
    this.player2.socket.join(this.roomId);
    this.rematchStatus = { player1: false, player2: false };
    this.gameOverDetails = {
      gameOverDescription: '',
      winnerColor: 'd',
    };
  }
  private getPlayerColor(id: string) {
    return id === this.player1.socket.id ? WHITE : BLACK; // player 1 is white and player 2 is black, always
  }
  getPlayer1() {
    return this.player1;
  }
  getPlayer2() {
    return this.player2;
  }
  getRoomId() {
    return this.roomId;
  }
  getOpponent(player: Player) {
    return player == this.player1 ? this.player2 : this.player1;
  }
  getFen() {
    return this.chess.fen();
  }
  getMoveHistory() {
    return this.chess.history();
  }
  getGameOverDetails() {
    return this.gameOverDetails;
  }
  isGameOver = () => {
    if (!this.chess.isGameOver()) return false;
    if (this.chess.isCheckmate()) {
      this.gameOverDetails = {
        ...this.gameOverDetails,
        gameOverDescription: 'checkmate',
        winnerColor: this.chess.turn() == WHITE ? BLACK : WHITE,
      };
    }
    else if (this.chess.isDraw()) {
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
}
