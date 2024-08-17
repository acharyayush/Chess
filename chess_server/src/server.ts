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
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});
const gameManager = new GameManager();
import { instrument } from '@socket.io/admin-ui';

io.on('connection', (socket) => {
  socket.on(JOIN_GAME, () => {
    gameManager.addPlayer(socket)
  });
  socket.on('disconnect', () => {
  });
});
server.listen(PORT, () => {
  console.log('Server is listening on PORT: ', PORT);
});
instrument(io, { auth: false });
