import { config } from 'dotenv';
config();
import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import GameManager from './GameManager';
import { JOIN_GAME, REJECT_REMATCH, REMATCH, RESIGN, SEND_MESSAGE } from './events';
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const io = new Server(server, {
  cors: {
    origin: ['https://admin.socket.io', `${CLIENT_URL}`],
    credentials: true,
  },
});
const gameManager = new GameManager(io);
let playerCount = 0;
import { instrument } from '@socket.io/admin-ui';
import { Player } from './types';
import Timer from './Timer';

io.on('connection', (socket) => {
  socket.on(JOIN_GAME, (name?: string, gameTimeInSec: number = 10 * 60) => {
    //TODO: search for the socket if exist in any game or waiting, if exist then fetch the data from there and emit to him/her else just add
    playerCount++;
    const playerName = name || 'guest' + playerCount;
    const player: Player = {
      name: playerName,
      timer: new Timer(gameTimeInSec),
      socket,
    };
    gameManager.addPlayer(player);
  });

  socket.on(REMATCH, () => {
    gameManager.handleRematch(socket);
  });
  socket.on(REJECT_REMATCH, () => {
    gameManager.handleRematchRejection(socket);
  });
  socket.on(RESIGN, () => {
    gameManager.handleResign(socket);
  });
  socket.on(SEND_MESSAGE, (message: string)=>{
    gameManager.handleMessageSend(socket, message);
  })
  socket.on('disconnect', () => {
    //remove player if he was in waiting list
    const wasWaiting = gameManager.removePlayerFromWaitingList(socket);
    if (wasWaiting) return;

    //TODO: try to reconnect and if it fails, remove player from the game, declare another player as winner
  });
});
server.listen(PORT, () => {
  console.log('Server is listening on PORT:', PORT);
});
instrument(io, { auth: false });
