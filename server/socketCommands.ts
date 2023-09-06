import { Server, Socket } from 'socket.io'

declare module 'socket.io' {
  interface Socket {
      username: string,
      readyStatus: boolean
  }
}
type Member = {
  username: string,
  readyStatus: boolean
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
          const { readyStatus, username } = socket
          if(username) members.push({username, readyStatus}) 
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

  return (socket: Socket)=>{
    console.log(io.engine.clientsCount)

    socket.username = socket.id
    socket.readyStatus = false
    console.log(`User ${socket.username} (${socket.id}) connected`)
    socket.emit('sending_username', socket.username)

    socket.on('create_room', (data) => {
      const roomName = data
      if(!roomExists(roomName)){
        socket.join(roomName)
        console.log(`User ${socket.username} (${socket.id}) created the room ${roomName}`)
        socket.emit('create_room_success', roomName)
      }else{
        socket.emit('room_name_taken', `The room name ${roomName} is already taken`)
      }
    })

    socket.on('join_room', (data)=>{
      const roomName = data
      if(roomExists(roomName)){
        socket.join(roomName)
        console.log(`User ${socket.username} (${socket.id}) joined room: ${roomName}`)
        
        io.to(roomName).emit('send_room', getRoom(roomName))
        socket.emit('join_room_success', roomName)
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
    
    socket.on('update_status', ({username, roomName})=>{
      const sockets = [...io.sockets.sockets.values()]
      const socketToUpdate = sockets.find(socket => socket.username === username)
      if(socketToUpdate !== undefined) socketToUpdate.readyStatus = !socketToUpdate.readyStatus
      
      const updatedRoom = getRooms().find(room => room.name === roomName)
      
      io.to(roomName).emit('status_updated', updatedRoom)
    })
    
    socket.on('send message', ()=>{
      console.log(`message received from user: ${socket.id}`)
    })

    socket.on('disconnect', ()=>{
      console.log(`User ${socket.username} (${socket.id}) disconnected`, socket.id)
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

    socket.on('error', function (err) {
      console.log(err);
    });
  }
}

export default socketCommands