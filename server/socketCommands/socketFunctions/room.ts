import { Server, Socket } from 'socket.io'
import { getRoom, getRooms, leaveAllOtherRooms, roomExists } from '../helperFunctions/room'

import { addKeyToSessions } from '../helperFunctions/sessions'

export const roomSocketFunctions = (socket: Socket, io: Server, MAX_ROOM_SIZE: number) =>{
  socket.on('create_room', ({name, roomName, avatar}, callback) => {
    socket.readyStatus = false
    if(!roomExists(roomName, io)){
      leaveAllOtherRooms(socket, io)
      socket.username = name
      socket.avatar = avatar
      socket.roomName = roomName
      addKeyToSessions(socket.sessionId, { sessionId: socket.sessionId, username:name, roomName, avatar, readyStatus:socket.readyStatus })
      socket.join(roomName)
      callback('success', socket.sessionId)
      console.log(`User ${socket.username} (${socket.id}) created the room ${roomName}`)
      //socket.emit('create_room_success', {name: socket.username, roomName})
    }else{
      socket.emit('room_name_taken', `The room name ${roomName} is already taken`)
    }
  })

  socket.on('join_room', ({name, roomName, avatar}, callback)=>{
    socket.readyStatus = false
    leaveAllOtherRooms(socket, io)
    if(roomExists(roomName, io)){
      if(getRoom(roomName, io)?.members.length === MAX_ROOM_SIZE) callback(`Room ${roomName} is currently full!`)
      else{
        socket.username = name
        socket.avatar = avatar
        socket.roomName = roomName
        addKeyToSessions(socket.sessionId, { sessionId: socket.sessionId, username:name, roomName, avatar, readyStatus:socket.readyStatus })
        socket.join(roomName)
        console.log(`User ${socket.username} (${socket.id}) joined room: ${roomName}`)
        
        io.to(roomName).emit('send_room', getRoom(roomName, io))
        callback('join_room_success', {name: socket.username, roomName, sessionId: socket.sessionId})
      }
    }else{
      callback(`There is no room ${roomName}`)
    }
  })

  socket.on('get_room', (name)=>{
    io.to(name).emit('send_room', getRoom(name, io))
  })
  
  socket.on('get_rooms', ()=>{
    const roomData = getRooms(io).filter(room => room.name.length !== 20)
    socket.emit('send_rooms', roomData)
  })

  socket.on('leave_room', () => {
    leaveAllOtherRooms(socket, io)
  })
}