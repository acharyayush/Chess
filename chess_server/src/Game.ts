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

  //supposing ,(It will be changed), player1 is white and player 2 is black
  constructor(player1: Socket, player2: Socket) {
    this.player1 = player1;
    this.player2 = player2;
    this.chess = new Chess();
    this.roomId = uuidv4();
    this.player1.join(this.roomId);
    this.player2.join(this.roomId);
  }
  private getPlayerColor(id: string) {
    return id === this.player1.id ? WHITE : BLACK;
  }
  getPlayer1() {
    return this.player1;
  }
  getPlayer2() {
    return this.player2;
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
}
