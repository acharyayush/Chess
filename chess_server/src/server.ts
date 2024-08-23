import { config } from 'dotenv';
config();
import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import GameManager from './GameManager';
import { JOIN_GAME } from './events';
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;
const io = new Server(server, {
  cors: {
    origin: ['https://admin.socket.io', `${process.env.CLIENT_URL}`],
    credentials: true,
  },
});
const gameManager = new GameManager(io);
let playerCount = 0;
import { instrument } from '@socket.io/admin-ui';

io.on('connection', (socket) => {
  socket.on(JOIN_GAME, (name: string) => {
    //TODO: search for the socket if exist in any game or waiting, if exist then fetch the data from there and emit to him/her else just add
    playerCount++;
    const playerName = name || 'guest' + playerCount;
    const player = {
      name: playerName,
      socket,
    };
    gameManager.addPlayer(player);
  });

  socket.on('rematch', () => {
    gameManager.handleRematch(socket);
  });

  socket.on('disconnect', () => {
    //remove player if he was in waiting list
    const wasWaiting = gameManager.removePlayerFromWaitingList(socket);
    if (wasWaiting) return;

    //try to reconnect and if it fails, remove player from the game, declare another player as winner
  });
});
server.listen(PORT, () => {
  console.log('Server is listening on PORT:', PORT);
});
instrument(io, { auth: false });
