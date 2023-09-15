import { Socket } from 'socket.io'
import { sessions } from '../helperFunctions/sessions'

export const sessionFunctions = (socket: Socket) =>{
  socket.on('restore_session', (sessionId, callback) => {
    if(sessionId in sessions){
      const { username, avatar, roomName } = sessions[sessionId].member
      socket.username = username
      socket.readyStatus = false
      socket.avatar = avatar
      socket.roomName = roomName
      socket.sessionId = sessionId
      if(roomName) socket.join(roomName)
      callback('success', { username, avatar, roomName })
    }else{
      callback('failed')
    }
  })
}