import { Server, Socket } from 'socket.io'

declare module 'socket.io' {
  interface Socket {
      username: string
  }
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