import { Server, Socket } from 'socket.io'

export const messageFunctions = (socket: Socket, io: Server) =>{
  socket.on("message_to_server", ({ author, message, roomName })=>{
    io.to(roomName).emit("message_to_client", { author, message })
  })
}
