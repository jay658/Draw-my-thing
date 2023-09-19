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

  socket.on("send_selected_word_to_other_players", ({roomName, word}) =>{
    socket.broadcast.to(roomName).emit('set_currentWord_on_client', word)
  })

  socket.on("get_word_choices", (roomName) =>{
    const words = games[roomName].getThreeWords()
    io.to(socket.id).emit('word_choices_from_server', words)
  })

  socket.on('guessed_correct_word', (roomName) => {
    io.to(roomName).emit('player_guessed_correct_word', socket.username)
  })
}