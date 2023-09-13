import { Member, Room } from '../types'
import { Server, Socket } from 'socket.io'

export const getRooms = (io: Server) => {
  const rooms = io.sockets.adapter.rooms
  const roomData: Room[] = []
  for(const [name, membersSet] of rooms){
    const members: Member[] = []
    const membersSetArray = [...membersSet]
    
    membersSetArray.forEach(memberStringId => {
      const socket = io.sockets.sockets.get(memberStringId)
      if(socket){
        const { sessionId, readyStatus, username, avatar } = socket
        if(username) members.push({ sessionId, username, readyStatus, avatar}) 
      }
    });
    roomData.push({name, members})
  }

  return roomData
}

export const getRoom = (roomName: string, io: Server) =>{
  return getRooms(io).find(room => room.name === roomName)
}

export const roomExists = (roomName: string, io: Server) => {
  const rooms = getRooms(io)
  
  for(let room of rooms){
    if(room.name === roomName) return true
  }

  return false
}

export const roomCanStartGame = (roomName: string, io: Server) => {
  const room = getRoom(roomName, io)
    if(room){
      const members = room.members
    
      for(let member of members) {
        if(member.readyStatus === false) return false
      }
      
      return true
    }
    return false
}

//this is all rooms minus the default room for the socket
export const getRoomsForASocket = (socket: Socket) => {
  return Array.from(socket.rooms).filter(room => room !== socket.id)
}

export const leaveAllOtherRooms = (socket: Socket, io:Server) => {
  const rooms = getRoomsForASocket(socket)
  rooms.forEach(roomName => {
    socket.leave(roomName)
    const room = getRoom(roomName, io)
    io.to(roomName).emit('send_room', room)
  })
}