import { Server, Socket } from 'socket.io'

export const disconnect = (socket: Socket, io: Server) =>{
  socket.on('disconnect', ()=>{
    const { roomName, sessionId } = socket
    if(roomName) io.to(roomName).emit('player_left', { sessionId })
    console.log(`User ${socket.username} (${socket.id}) disconnected`, socket.id)
  })
}