import { Server, Socket } from 'socket.io'
import { getRoom, getRooms, roomCanStartGame } from '../helperFunctions/room'

import { addGame } from '../helperFunctions/games'
import { wordbank } from '../wordbank'

export const statusFunctions = (socket: Socket, io: Server) =>{
  socket.on('update_status', ({ sessionId, roomName })=>{
    const sockets = [...io.sockets.sockets.values()]
    const socketToUpdate = sockets.find(socket => socket.sessionId === sessionId)
    if(socketToUpdate !== undefined) socketToUpdate.readyStatus = !socketToUpdate.readyStatus
    
    const room = getRooms(io).find(room => room.name === roomName)
    
    if(room !== undefined) {
      io.to(roomName).emit('status_updated', room.members)
    }
    //else return error message
  })

  socket.on('check_if_everyone_is_ready', (roomName) => {
    if(roomCanStartGame(roomName, io)) {
      const room = getRoom(roomName, io)
      if(room !== undefined){
        const gameInfo = {
          name: room.name,
          players: room.members,
          wordbank,
          roomName
        }
        addGame(gameInfo)
        io.to(roomName).emit('starting_game')
      }
    }
    else socket.emit('players_not_ready', 'All players must be ready to start the game.')
  })
}