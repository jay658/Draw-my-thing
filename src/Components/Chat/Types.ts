type MessageT = {
  author: User | Server
  message: string
} 

type User = {
  sessionId: string,
  username: string
}

type Server = 'Server'

export type {
  MessageT,
}