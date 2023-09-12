import { Socket } from 'socket.io'

export const socketInfo = (socket: Socket) =>{
  socket.on("get_socket_info", () => {
    const { username, readyStatus, avatar, roomName } = socket
    socket.emit("sending_socket_info", { username, readyStatus, avatar, roomName})
  })
}