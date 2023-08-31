import * as appServer from './app'

import { Server, Socket } from 'socket.io'

import { createServer } from 'http'

const app = appServer.app

const httpServer = createServer(app)

const PORT = 5137

const io = new Server(httpServer, {
  cors: {
    origin: `http://localhost:${PORT}`
  }
})

export const socketCommands = (socket: Socket)=>{
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
}