import { io } from 'socket.io-client'
import website from '../../Store/RTK/index'

const socket = io(website)

export default socket