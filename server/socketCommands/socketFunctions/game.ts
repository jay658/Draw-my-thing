import { Server, Socket } from 'socket.io'

import { games } from '../helperFunctions/games'

export const gameFunctions = (socket: Socket, io: Server) =>{
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

  socket.on('next_drawer', (roomName) => {
    const game = games[roomName]
    const { drawerIdx, round, players } = game
    let nextDrawerIdx = drawerIdx, nextRound = round

    if(nextDrawerIdx === players.length - 1){
      nextDrawerIdx = 0
      nextRound++
    }else nextDrawerIdx++

    game.lines = []
    game.drawerIdx = nextDrawerIdx
    game.round = nextRound

    io.to(roomName).emit('update_drawer_and_round', nextDrawerIdx, nextRound)
  })
}