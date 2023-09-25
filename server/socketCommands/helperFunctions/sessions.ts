import { Member, SessionT } from '../types'

import { Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

export const generateSessionId = () => {
  return uuidv4()
}

export const sessions: SessionT= {}

export const addKeyToSessions = (key: string, value: Member) => {
  if(key in sessions && sessions[key].timerId) clearTimeout(sessions[key].timerId)

  const timerId = setTimeout(() => {
    console.log(`Deleting ${key}`)
    delete sessions[key]
  }, 1000 * 60 * 60)

  sessions[key] = { member: value, timerId }
}

export const restoreSession = (socket:Socket, sessionId: string) => {
  const { username, avatar, roomName } = sessions[sessionId].member
  socket.username = username
  socket.readyStatus = false
  socket.avatar = avatar
  socket.roomName = roomName
  socket.sessionId = sessionId
  if(roomName) socket.join(roomName)

  return { username, avatar, roomName }
}