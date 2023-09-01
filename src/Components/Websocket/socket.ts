import { Socket, io } from 'socket.io-client'

import website from '../../Store/RTK/index'

declare module 'socket.io-client' {
  interface Socket {
      username: string
  }
}

const socket: Socket = io(website)

export default socket