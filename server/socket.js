// /server/socket.js (for example)
import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('sendMessage', (messageData) => {
      // Broadcast the message to everyone (except the sender)
      socket.broadcast.emit('receiveMessage', messageData);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });
  });

  res.end();
};

export default SocketHandler;
