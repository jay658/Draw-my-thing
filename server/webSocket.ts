import { io } from ".";

io.on('connection', (socket)=>{
  console.log(`User connected: ${socket.id}`)

  socket.on('join_room', (data)=>{
    socket.join(data)
    console.log(`User with ID: ${socket.id} joined room: ${data}`)
  })

  socket.on('send_message', (data)=>{
    socket.to(data.room).emit('receive_message', data)
    console.log(`message sent to room ${data.room}`)
  })

  socket.on('disconnect', ()=>{
    console.log('User disconnected', socket.id)
  })

  socket.on('error', function (err) {
    console.log(err);
  });
})