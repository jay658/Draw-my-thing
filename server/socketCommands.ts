import { Server, Socket } from 'socket.io'

const socketCommands = (io: Server)=>{
  return (socket: Socket)=>{
    console.log(`User connected: ${socket.id}`)
    console.log(io.engine.clientsCount)

    socket.on('join_room', (data)=>{
      socket.join(data)
      console.log(`User with ID: ${socket.id} joined room: ${data}`)
    })

    socket.on('send message', ()=>{
      console.log(`message received from user: ${socket.id}`)
    })

    socket.on('disconnect', ()=>{
      console.log('User disconnected', socket.id)
    })

    socket.on('error', function (err) {
      console.log(err);
    });
  }
}

export default socketCommands