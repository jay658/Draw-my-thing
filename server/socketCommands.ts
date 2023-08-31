import { Socket } from 'socket.io'

const socketCommands = (socket: Socket)=>{
  console.log(`User connected: ${socket.id}`)

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

export default socketCommands