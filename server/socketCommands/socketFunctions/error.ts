import { Socket } from 'socket.io'

export const socketError = (socket: Socket) =>{
  socket.on('error', function (err) {
    console.log(err);
  });
}