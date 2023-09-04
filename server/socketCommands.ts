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
  return (socket: Socket)=>{
    console.log(`User connected: ${socket.id}`)
    console.log(io.engine.clientsCount)

    socket.username = `anonymous${io.engine.clientsCount}`
    socket.emit('sending username', socket.username)

    console.log(socket.username)

    socket.on('join_room', (data)=>{
      socket.join(data)
      console.log(`User with ID: ${socket.id} joined room: ${data}`)
    })

    socket.on('get_rooms', ()=>{
      const rooms = io.sockets.adapter.rooms
      
      const roomData: Array<Room> = []
      
      for(const [name, membersSet] of rooms){
        
        roomData.push({name, members:[...membersSet]})
      }
      // roomData.filter(roomArray => roomArray[0].length < 20) to filter the default rooms created for each socket
      
      socket.emit('send_rooms', roomData)
    })
    
    socket.on('send message', ()=>{
      console.log(`message received from user: ${socket.id}`)
    })

    socket.on('disconnect', ()=>{
      console.log('User disconnected', socket.id)
    })

    socket.on('add username', (data) => {
      const { username } = data
      socket.username = username
      socket.emit('sending username', socket.username)
    })

    socket.on('error', function (err) {
      console.log(err);
    });
  }
}

export default socketCommands