import { Server, Socket } from 'socket.io';
import { INIT_GAME, SEND_MOVE } from './events';
import Game from './Game';
import { Move } from './types';
import { BLACK, WHITE } from 'chess.js';

export default class GameManager {
  private io;
  private games: Game[] = [];
  private waitingPlayer: Socket | null = null;
  constructor(io: Server) {
    this.io = io;
  }
  private findGame(player: Socket) {
    return this.games.find((game) => (game.getPlayer1().id === player.id || game.getPlayer2().id===player.id));
  }
  private emitToInitiateGame(game:Game){
    this.io.to(game.getPlayer1().id).emit(INIT_GAME, { mainPlayer: WHITE });
    this.io.to(game.getPlayer2().id).emit(INIT_GAME, { mainPlayer: BLACK });
  }
  private addMoveEventHandler(player: Socket) {
    player.on(SEND_MOVE, (move: Move) => {
      //get the game that belongs to the socket getting move
      const game = this.findGame(player);
      try{
      //make the move in that game
      game?.makeMove(player, move);
      }catch(e){
        //this is just an invalid move
      }
    });
  }
  addPlayer(player: Socket) {
    this.addMoveEventHandler(player);
    if (!this.waitingPlayer) {
      this.waitingPlayer = player;
      return;
    }
    const game = new Game(this.waitingPlayer, player);
    this.games.push(game);
    //send event to both sockets to start the game
    //socket 1 = WHITE and socket 2 = BLACK
    this.emitToInitiateGame(game)
    this.waitingPlayer = null;
  }
  removePlayerFromWaitingList(player: Socket) {
    if (this.waitingPlayer?.id === player.id) {
      this.waitingPlayer = null;
      return true;
    }
    return false;
  }
  handleRematch(player: Socket) {
    const game = this.findGame(player);
    if(!game) return;
    const isReady = game.handleResetForRematch(player)
    if(isReady){
      this.emitToInitiateGame(game)
    }
  }
}
