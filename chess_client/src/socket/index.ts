import { io, Socket } from 'socket.io-client';
const URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
const socket:Socket = io(URL);
export default socket;