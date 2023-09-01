import { Server } from 'socket.io'
import { ViteDevServer } from 'vite'
import socketCommands from './server/socketCommands'

export function configureServer(server: ViteDevServer){
  if(!server.httpServer){
    throw new Error('No httpServer found')
  }

  const io = new Server(server.httpServer)
  
  io.on('connection', socketCommands(io))
}

export const webSocket = {
  name: 'websocket',
  configureServer
}