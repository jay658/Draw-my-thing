import { Server, Socket } from 'socket.io'

declare module 'socket.io' {
  interface Socket {
      username: string,
      readyStatus: boolean
      avatar: string
  }
}
type Member = {
  username: string,
  readyStatus: boolean, 
  avatar: string
}
type Room = {
  name: string,
  members: Member[]
}

const socketCommands = (io: Server)=>{
  
  const getRooms = () => {
    const rooms = io.sockets.adapter.rooms
    const roomData: Room[] = []

    for(const [name, membersSet] of rooms){
      const members: Member[] = []
      const membersSetArray = [...membersSet]
      
      membersSetArray.forEach(memberStringId => {
        const socket = io.sockets.sockets.get(memberStringId)
        if(socket){
          const { readyStatus, username, avatar } = socket
          if(username) members.push({username, readyStatus, avatar}) 
        }
      });
      roomData.push({name, members})
    }

    return roomData
  }

  const getRoom = (roomName: string) =>{
    return getRooms().find(room => room.name === roomName)
  }

  const roomExists = (roomName: string) => {
    const rooms = getRooms()
    
    for(let room of rooms){
      if(room.name === roomName) return true
    }

    return false
  }

  const roomCanStartGame = (roomName: string) => {
    const room = getRoom(roomName)
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
  const getRoomsForASocket = (socket: Socket) => {
    return Array.from(socket.rooms).filter(room => room !== socket.id)
  }

  const leaveAllOtherRooms = (socket: Socket) => {
    const rooms = getRoomsForASocket(socket)
    rooms.forEach(roomName => {
      socket.leave(roomName)
      const room = getRoom(roomName)
      io.to(roomName).emit('send_room', room)
    })
  }

  return (socket: Socket)=>{
    console.log(io.engine.clientsCount)

    socket.username = socket.id
    socket.readyStatus = false
    socket.avatar = 'Elephant Circus'
    console.log(`User ${socket.username} (${socket.id}) connected`)
    socket.emit('sending_username', socket.username)

    socket.on('create_room', ({name, roomName, avatar}) => {
      socket.readyStatus = false
      if(!roomExists(roomName)){
        leaveAllOtherRooms(socket)
        socket.username = name
        socket.avatar = avatar
        socket.join(roomName)
        console.log(`User ${socket.username} (${socket.id}) created the room ${roomName}`)
        socket.emit('create_room_success', {name: socket.username, roomName})
      }else{
        socket.emit('room_name_taken', `The room name ${roomName} is already taken`)
      }
    })

    socket.on('join_room', ({name, roomName, avatar})=>{
      socket.readyStatus = false
      if(roomExists(roomName)){
        leaveAllOtherRooms(socket)
        socket.username = name
        socket.avatar = avatar
        socket.join(roomName)
        console.log(`User ${socket.username} (${socket.id}) joined room: ${roomName}`)
        
        io.to(roomName).emit('send_room', getRoom(roomName))
        socket.emit('join_room_success', {name: socket.username, roomName})
      }else{
        socket.emit('room_not_found', `There is no room ${roomName}`)
      }
    })

    socket.on('get_room', (name)=>{
      socket.emit('send_room', getRoom(name))
    })
    
    socket.on('get_rooms', ()=>{
      const roomData = getRooms().filter(room => room.name.length !== 20)
      socket.emit('send_rooms', roomData)
    })

    socket.on('leave_room', () => {
      leaveAllOtherRooms(socket)
    })

    socket.on("get_socket_info", () => {
      const { username, readyStatus, avatar } = socket
      socket.emit("sending_socket_info", { username, readyStatus, avatar})
    })
    
    socket.on('update_status', ({username, roomName})=>{
      const sockets = [...io.sockets.sockets.values()]
      const socketToUpdate = sockets.find(socket => socket.username === username)
      if(socketToUpdate !== undefined) socketToUpdate.readyStatus = !socketToUpdate.readyStatus
      
      const updatedRoom = getRooms().find(room => room.name === roomName)
      
      io.to(roomName).emit('status_updated', updatedRoom)
    })

    socket.on('check_if_everyone_is_ready', (roomName) => {
      if(roomCanStartGame(roomName)) io.to(roomName).emit('starting_game')
      else socket.emit('players_not_ready', 'All players must be ready to start the game.')
    })

    //can remove
    socket.on('add_username', (data) => {
      const { username } = data
      socket.username = username
      socket.emit('sending_username', socket.username)
    })

    socket.on('update_username', (data) => {
      socket.username = data
      socket.emit('sending_username', socket.username)
    })

    socket.on("message_to_server", ({author, message, roomName})=>{
      io.to(roomName).emit("message_to_client", { author:author, message:message })
    })

    socket.on('disconnect', ()=>{
      console.log(`User ${socket.username} (${socket.id}) disconnected`, socket.id)
    })

    socket.on('error', function (err) {
      console.log(err);
    });
  }
}

export default socketCommands