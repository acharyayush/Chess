import { Server, Socket } from 'socket.io';
import {
  GAMEOVER,
  INIT_GAME,
  RECEIVE_CAPTURED_DETAILS,
  RECEIVE_FEN,
  RECEIVE_MOVE_HISTORY,
  RECEIVE_PLAYER_DETAILS,
  SEND_MOVE,
} from './events';
import Game from './Game';
import { Move, Player } from './types';
import { BLACK, WHITE } from 'chess.js';

export default class GameManager {
  private io;
  private games: Game[] = [];
  private waitingPlayer: Player | null = null;
  constructor(io: Server) {
    this.io = io;
  }
  private findGame(player: Socket) {
    return this.games.find(
      (game) =>
        game.player1.socket.id === player.id ||
        game.player2.socket.id === player.id
    );
  }
  private emitToInitiateGame(game: Game) {
    this.io.to(game.player1.socket.id).emit(INIT_GAME, {
      fen: game.getFen(),
      mainPlayer: WHITE,
    });
    this.io.to(game.player2.socket.id).emit(INIT_GAME, {
      fen: game.getFen(),
      mainPlayer: BLACK,
    });
    this.io
      .to(game.roomId)
      .emit(RECEIVE_PLAYER_DETAILS, {
        player1: game.player1.name,
        player2: game.player2.name,
      });
  }
  private addMoveEventHandler(socket: Socket) {
    socket.on(SEND_MOVE, (move: Move) => {
      //get the game that belongs to the socket getting move
      const game = this.findGame(socket);
      if (!game) return;
      try {
        //make the move in that game
        const moveRes = game.makeMove(socket, move);
        if (!moveRes) return;
        const isCapturedOrPromoted = game.handleCapturedPiecesAndScores(moveRes)
        this.io
          .to(game.roomId)
          .emit(RECEIVE_FEN, { fen: game.getFen(), flag: moveRes.flags });
        this.io
          .to(game.roomId)
          .emit(RECEIVE_MOVE_HISTORY, game.getMoveHistory())
          if(game.isGameOver()) this.io.to(game.roomId).emit(GAMEOVER, game.gameOverDetails)
          if(isCapturedOrPromoted) this.io.to(game.roomId).emit(RECEIVE_CAPTURED_DETAILS, game.capturedDetails)
      } catch (e) {
        //this is just an invalid move
      }
    });
  }
  addPlayer(player: Player) {
    this.addMoveEventHandler(player.socket);
    if (!this.waitingPlayer) {
      this.waitingPlayer = player;
      return;
    }
    const game = new Game(this.waitingPlayer, player);
    this.games.push(game);
    //send event to both sockets to start the game
    //socket 1 = WHITE and socket 2 = BLACK
    this.emitToInitiateGame(game);
    this.waitingPlayer = null;
  }
  removePlayerFromWaitingList(socket: Socket) {
    if (this.waitingPlayer?.socket.id === socket.id) {
      this.waitingPlayer = null;
      return true;
    }
    return false;
  }
  handleRematch(socket: Socket) {
    const game = this.findGame(socket);
    if (!game) return;
    const isReady = game.handleResetForRematch(socket);
    if (isReady) {
      this.emitToInitiateGame(game);
    }
  }
}
