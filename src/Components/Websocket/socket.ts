import { Socket, io } from 'socket.io-client'

import website from '../../Store/RTK/index'

declare module 'socket.io-client' {
  interface Socket {
      username: string,
      readyStatus: boolean,
      avatar: string,
      roomName?: string    
  }
}

const socket: Socket = io(website, {autoConnect: false})

export default socket