import { Socket } from 'socket.io'
import { games} from '../helperFunctions/games'

export const gameFunctions = (socket: Socket) =>{
  socket.on('get_game_info', (roomName)=>{
    socket.emit('send_game_info_to_client', games[roomName])
  })
}