import { restoreSession, sessions } from '../helperFunctions/sessions'

import { Socket } from 'socket.io'
import { games } from '../helperFunctions/games'

export const sessionFunctions = (socket: Socket) =>{
  socket.on('restore_game_session', ({ sessionId, roomName }, callback) => {
    if(sessionId in sessions && roomName in games){
      const userInfo = restoreSession(socket, sessionId)
      callback('success', userInfo)
    }else{
      callback('failed')
    }
  })

  socket.on('restore_waiting_room_session', (sessionId, callback) => {
    if(sessionId in sessions){
      const userInfo = restoreSession(socket, sessionId)
      callback('success', userInfo)
    }else{
      callback('failed')
    }
  })
}
