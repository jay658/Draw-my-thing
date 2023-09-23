import { Game, GamesT, Member, gameInfo } from '../types'

import { Socket } from 'socket.io'

export const games: GamesT = {}

export const addGame = (gameInfo: gameInfo) => {
  games[gameInfo.name] = new Game(gameInfo)
}

export const restoreSession = (socket: Socket, sessionId: string, userInfo: Member) => {
  const { username, avatar, roomName } = userInfo
      socket.username = username
      socket.readyStatus = false
      socket.avatar = avatar
      socket.roomName = roomName
      socket.sessionId = sessionId
      if(roomName) socket.join(roomName)
}