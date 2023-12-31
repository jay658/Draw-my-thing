import { Server, Socket } from 'socket.io'

import { games } from '../helperFunctions/games'

export const gameFunctions = (socket: Socket, io: Server) =>{
  socket.on('get_game_info', (roomName)=>{
    const { players, elapsedSeconds, currentWord, drawerIdx, round, currentPhase } = games[roomName]
    socket.emit('send_game_info_to_client', { players, elapsedSeconds, currentWord, drawerIdx, round, currentPhase } );
  })

  socket.on('update_drawing', ({roomName, lines}: { roomName: string, lines: number[][]}) => {
    games[roomName].lines = lines
    socket.broadcast.to(roomName).emit('sending_updated_drawing', lines)
  })

  socket.on('get_drawing', (roomName, callback) => {
    callback(games[roomName].lines)
  })

  socket.on("send_selected_word_to_other_players", ({roomName, word}) =>{
    const game = games[roomName]
    game.currentWord = word
    game.currentPhase = "Drawing"
    const phase = game.currentPhase
    io.to(roomName).emit('set_currentWord_on_client', {word, phase})
    game.startTimer(io)
  })

  socket.on("get_word_choices", (roomName) =>{
    const words = games[roomName].getThreeWords()
    io.to(socket.id).emit('word_choices_from_server', words)
  })

  socket.on('guessed_correct_word', (roomName) => {
    const game = games[roomName]
    const currPlayer = game.players.find(player => player.sessionId === socket.sessionId)
    const drawer = game.players[game.drawerIdx]
    
    if(currPlayer && !currPlayer.pointsThisRound){
      drawer.pointsThisRound += 50
      game.guessOrder.push(socket.username)
      if(game.guessOrder.length === 1) currPlayer.pointsThisRound += 300
      else if(game.guessOrder.length === 2) currPlayer.pointsThisRound += 200
      else currPlayer.pointsThisRound += 100
      game.setTimePenalty(io)
      io.to(roomName).emit('player_guessed_correct_word', socket.username)
      io.to(roomName).emit('update_scores', game.players)
    }
  })
}