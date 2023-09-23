import { Server, Socket } from 'socket.io'

import { games } from '../helperFunctions/games'

export const gameFunctions = (socket: Socket, io: Server) =>{
  socket.on('get_game_info', (roomName)=>{
    const { players, elapsedSeconds, currentWord } = games[roomName]
    socket.emit('send_game_info_to_client', { players, elapsedSeconds, currentWord } );
  })

  socket.on('update_drawing', ({roomName, lines}: { roomName: string, lines: number[][]}) => {
    games[roomName].lines = lines
    socket.broadcast.to(roomName).emit('sending_updated_drawing', lines)
  })

  socket.on('get_drawing', (roomName, callback) => {
    callback(games[roomName].lines)
  })

  socket.on('next_drawer', (roomName) => {
    //Move this to the game object after testing so we don't make an extra back and forth call between client and server (startEndOfRoundScoreboardTimer game object method and the endOfRoundScoreboard file's useeffect)
    const game = games[roomName]
    const { drawerIdx, round, players } = game

    let nextDrawerIdx = drawerIdx, nextRound = round

    if(nextDrawerIdx === players.length - 1){
      nextDrawerIdx = 0
      nextRound++
    }else nextDrawerIdx++
    
    players.forEach(player => {
      player.score += player.pointsThisRound
      player.pointsThisRound = 0
    })
    
    game.resetForNextRound(nextDrawerIdx, nextRound)
    
    if(game.gameClock) clearInterval(game.gameClock)
    io.to(roomName).emit('update_drawer_and_round', { drawerIdx: nextDrawerIdx, round: nextRound, players })
  })

  socket.on("end_of_round", (roomName)=>{
    io.to(roomName).emit("end_of_round_to_client")
  })
  
  socket.on("get_roundend_scoreboard", (roomName)=>{
    const game = games[roomName]
    const { players } = game
    socket.emit('send_scoreboard_to_client', players)
    
    game.startEndOfRoundScoreboardTimer(io)
  })

  socket.on("send_selected_word_to_other_players", ({roomName, word}) =>{
    games[roomName].currentWord = word
    io.to(roomName).emit('set_currentWord_on_client', word)
    games[roomName].startTimer(io)
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