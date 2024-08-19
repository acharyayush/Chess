import { BLACK, Chess, WHITE } from 'chess.js';
import { Move } from './types';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { RECEIVE_MOVE } from './events';
export default class Game {
  private player1: Socket;
  private player2: Socket;
  private chess: Chess;
  private roomId: string;
  private rematchStatus: { player1: boolean; player2: boolean };

  // player 1 is always white amd player 2 is always black
  constructor(player1: Socket, player2: Socket) {
    this.player1 = player1;
    this.player2 = player2;
    this.chess = new Chess();
    this.roomId = uuidv4();
    this.player1.join(this.roomId);
    this.player2.join(this.roomId);
    this.rematchStatus = { player1: false, player2: false };
  }
  private getPlayerColor(id: string) {
    return id === this.player1.id ? WHITE : BLACK; // player 1 is white and player 2 is black, always
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
  getOpponent(player: Socket) {
    return player == this.player1 ? this.player2 : this.player1;
  }
  //if player is making move on his turn then update chess by making move
  makeMove(player: Socket, move: Move) {
    try {
      let playerColor = this.getPlayerColor(player.id);
      if (playerColor != this.chess.turn()) return;
      this.chess.move(move);
      player.to(this.roomId).emit(RECEIVE_MOVE, move);
    } catch (e) {
      throw e;
    }
  }
  handleResetForRematch(player: Socket) {
    //reset only if both players are requesting to rematch
    if (!this.rematchStatus.player1 && player.id === this.player1.id) {
      this.rematchStatus.player1 = true;
    }
    if (!this.rematchStatus.player2 && player.id === this.player2.id) {
      this.rematchStatus.player2 = true;
    }
    if (!this.rematchStatus.player1 || !this.rematchStatus.player2)
      return false;

    this.chess = new Chess();
    //swapping player color after rematch
    let temp = this.player1;
    this.player1 = this.player2;
    this.player2 = temp;
    this.rematchStatus = { player1: false, player2: false };
    return true;
  }
}
