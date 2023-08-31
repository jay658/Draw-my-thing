import { Server } from 'socket.io'
import { ViteDevServer } from 'vite'

export function configureServer(server: ViteDevServer){
  if(!server.httpServer){
    throw new Error('No httpServer found')
  }

  const io = new Server(server.httpServer)
  
  io.on('connection', (socket) => {
    console.log(`A user connected with ID: ${socket.id}`)
    socket.on('send message', () =>{
      console.log('this is working!!')
    })
  })
}

export const webSocket = {
  name: 'websocket',
  configureServer
}