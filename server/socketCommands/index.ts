import { Server, Socket } from 'socket.io'

import { disconnect } from './socketFunctions/disconnect'
import { gameFunctions } from './socketFunctions/game'
import { games } from './helperFunctions/games'
import { generateSessionId } from './helperFunctions/sessions'
import { messageFunctions } from './socketFunctions/message'
import { roomSocketFunctions } from './socketFunctions/room'
import { sessionFunctions } from './socketFunctions/session'
import { socketError } from './socketFunctions/error'
import { socketInfo } from './socketFunctions/socketInfo'
import { statusFunctions } from './socketFunctions/status'

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

    io.of('/').adapter.on("delete-room", (room)=>{
      delete games[room]
    })

    socket.sessionId = generateSessionId()
    socket.username = socket.id
    socket.readyStatus = false
    socket.avatar = 'Lounging Fox'
    console.log(`User ${socket.username} (${socket.id}) connected`)

    roomSocketFunctions(socket, io, MAX_ROOM_SIZE)
    socketInfo(socket)
    sessionFunctions(socket)
    statusFunctions(socket, io)
    messageFunctions(socket, io)
    gameFunctions(socket)
    disconnect(socket, io)
    socketError(socket)
  }
}

export default socketCommands

