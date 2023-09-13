import { Server, Socket } from 'socket.io'
import { generateSessionId, sessions } from './helperFunctions/session'

import { disconnect } from './socketFunctions/disconnect'
import { messageFunctions } from './socketFunctions/message'
import { roomSocketFunctions } from './socketFunctions/room'
import { sessionFunctions } from './socketFunctions/session'
import { socketInfo } from './socketFunctions/socketInfo'
import { statusFunctions } from './socketFunctions/status'
import { socketError } from './socketFunctions/error'

declare module 'socket.io' {
  interface Socket {
      sessionId: string,
      username: string,
      readyStatus: boolean,
      avatar: string,
      roomName?: string
  }
}

const MAX_ROOM_SIZE = 8

const socketCommands = (io: Server)=>{

  return (socket: Socket)=>{
    console.log(io.engine.clientsCount)

    socket.sessionId = generateSessionId()
    socket.username = socket.id
    socket.readyStatus = false
    socket.avatar = 'Lounging Fox'
    console.log(`User ${socket.username} (${socket.id}) connected`)

    roomSocketFunctions(socket, io, MAX_ROOM_SIZE)
    socketInfo(socket)
    sessionFunctions(socket, sessions)
    statusFunctions(socket, io)
    messageFunctions(socket, io)
    disconnect(socket, io)
    socketError(socket)
  }
}

export default socketCommands

