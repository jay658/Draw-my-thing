import { Server, Socket } from 'socket.io'
import { getRoom, getRooms, roomCanStartGame } from '../helperFunctions/room'
import { addGame } from '../helperFunctions/games'
import { wordbank } from '../wordbank'

export const statusFunctions = (socket: Socket, io: Server) =>{
  socket.on('update_status', ({username, roomName})=>{
    const sockets = [...io.sockets.sockets.values()]
    const socketToUpdate = sockets.find(socket => socket.username === username)
    if(socketToUpdate !== undefined) socketToUpdate.readyStatus = !socketToUpdate.readyStatus
    
    const updatedRoom = getRooms(io).find(room => room.name === roomName)
    
    io.to(roomName).emit('status_updated', updatedRoom)
  })

  socket.on('check_if_everyone_is_ready', (roomName) => {
    if(roomCanStartGame(roomName, io)) {
      const room = getRoom(roomName, io)
      if(room !== undefined){
        const gameInfo = {
          name: room.name,
          players: room.members,
          wordbank
        }
        addGame(gameInfo)
        io.to(roomName).emit('starting_game')
      }
      // else emit error?
    }
    else socket.emit('players_not_ready', 'All players must be ready to start the game.')
  })
}