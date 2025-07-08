import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // Ganti port kalau backend beda

export default socket;
