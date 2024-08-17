import { Socket } from 'socket.io';
import { INIT_GAME, RECEIVE_MOVE } from './events';
import Game from './Game';
import { Move} from './types';

export default class GameManager {
  private games: Game[] = [];
  private waitingPlayer: Socket | null = null;
  private addMoveEventHandler(socket: Socket) {
    socket.on(RECEIVE_MOVE, (move: Move) => {
      console.log(move);
      //get the game that belongs to the socket getting move
      let game = this.games.find(
        (game) => game.getPlayer1().id === socket.id
      );
      //make the move in that game
      console.log("i am gonna make move now")
      game?.makeMove(socket, move);
    });
  }
  addPlayer(player: Socket) {
    this.addMoveEventHandler(player);
    if (!this.waitingPlayer) {
      this.waitingPlayer = player;
      return;
    }
    let game = new Game(this.waitingPlayer, player);
    this.games.push(game);
    //send event to both sockets to start the game
    player.emit(INIT_GAME);
    this.waitingPlayer = null;
  }
}
