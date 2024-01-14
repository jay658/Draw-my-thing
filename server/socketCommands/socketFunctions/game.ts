import { Server, Socket } from 'socket.io'

import { games } from '../helperFunctions/games'

export const gameFunctions = (socket: Socket, io: Server) =>{
  socket.on('get_game_info', (roomName)=>{
    const { players, elapsedSeconds, currentWord, drawerIdx, round, currentPhase,  drawingUrls} = games[roomName]
    socket.emit('send_game_info_to_client', { players, elapsedSeconds, currentWord, drawerIdx, round, currentPhase, pictureUrls: drawingUrls});
  })

  socket.on('update_drawing', ({roomName, lines}: { roomName: string, lines: number[][]}) => {
    games[roomName].lines = lines
    socket.broadcast.to(roomName).emit('sending_updated_drawing', lines)
  })

  socket.on('get_drawing', (roomName, callback) => {
    callback(games[roomName].lines)
  })

  socket.on('save_drawing', (roomName, pictureUrl) => {
    const game = games[roomName]
    game.savePicture(pictureUrl)
  })

  socket.on('get_all_pictures', (roomName) => {
    const game = games[roomName]
    const pictures = game.drawingUrls
    socket.emit('send_pictures', pictures)
  })

  socket.on("send_selected_word_to_other_players", ({roomName, word}) =>{
    const game = games[roomName]
    game.currentWord = word
    game.nextPhase(io)
  })

  socket.on("get_word_choices", (roomName) =>{
    const words = games[roomName].getThreeWords()
    io.to(socket.id).emit('word_choices_from_server', words)
  })

  socket.on('guessed_correct_word', (roomName) => {
    const game = games[roomName]
    const currPlayer = game.players.find(player => player.sessionId === socket.sessionId)
    const drawer = game.players[game.drawerIdx]
    
    if(currPlayer && !currPlayer.pointsThisTurn){
      drawer.pointsThisTurn += 50
      game.guessOrder.push(socket.username)
      if(game.guessOrder.length === 1) currPlayer.pointsThisTurn += 300
      else if(game.guessOrder.length === 2) currPlayer.pointsThisTurn += 200
      else currPlayer.pointsThisTurn += 100
      game.setTimePenalty(io)
      io.to(roomName).emit('player_guessed_correct_word', socket.username)
      io.to(roomName).emit('update_scores', game.players)
    }
  })
}