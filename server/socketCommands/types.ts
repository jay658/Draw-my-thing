export type Member = {
  sessionId: string
  username: string,
  readyStatus: boolean, 
  avatar: string,
  roomName?: string
}
export type Room = {
  name: string,
  members: Member[]
}

export type Session = Record<string, {member: Member, timerId: NodeJS.Timeout}>