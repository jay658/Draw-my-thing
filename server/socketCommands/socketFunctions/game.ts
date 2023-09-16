import { Socket } from 'socket.io'
import { games } from '../helperFunctions/games'

export const gameFunctions = (socket: Socket) =>{
  socket.on('get_game_info', (roomName)=>{
    socket.emit('send_game_info_to_client', games[roomName])
  })

  socket.on('update_drawing', ({roomName, lines}: { roomName: string, lines: number[][]}) => {
    games[roomName].lines = lines
    socket.broadcast.to(roomName).emit('sending_updated_drawing', lines)
  })

  socket.on('get_drawing', (roomName, callback) => {
    callback(games[roomName].lines)
  })
}