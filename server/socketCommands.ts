import { Server, Socket } from 'socket.io'

declare module 'socket.io' {
  interface Socket {
      username: string
  }
}
type Room = {
  name: string,
  members: string[]
}

const socketCommands = (io: Server)=>{

  const getRooms = () => {
    const rooms = io.sockets.adapter.rooms
    const roomData: Array<Room> = []

    for(const [name, membersSet] of rooms){ 
      roomData.push({name, members:[...membersSet]})
    }

    return roomData
  }

  const doesRoomExists = (roomName: string) => {
    const rooms = getRooms()
    
    for(let room of rooms){
      if(room.name === roomName) return true
    }

    return false
  }

  return (socket: Socket)=>{
    console.log(io.engine.clientsCount)

    socket.username = `anonymous`
    console.log(`User ${socket.username} (${socket.id}) connected`)
    socket.emit('sending_username', socket.username)

    socket.on('create_room', (data) => {
      const roomName = data
      
      if(!doesRoomExists(roomName)){
        socket.join(roomName)
        console.log(`User ${socket.username} (${socket.id}) created the room ${roomName}`)
      }else{
        socket.emit('room_name_taken', `The room name ${roomName} is already taken`)
      }
    })

    socket.on('join_room', (data)=>{
      const roomName = data
      if(doesRoomExists(roomName)){
        socket.join(roomName)
        console.log(`User ${socket.username} (${socket.id}) joined room: ${roomName}`)
      }else{
        socket.emit('room_not_found', `There is no room ${roomName}`)
      }
    })

    socket.on('get_rooms', ()=>{
      const roomData = getRooms().filter(room => room.name.length !== 20)
      // roomData.filter(roomArray => roomArray[0].length < 20) to filter the default rooms created for each socket
      socket.emit('send_rooms', roomData)
    })
    
    socket.on('send message', ()=>{
      console.log(`message received from user: ${socket.id}`)
    })

    socket.on('disconnect', ()=>{
      console.log(`User ${socket.username} (${socket.id}) disconnected`, socket.id)
    })

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