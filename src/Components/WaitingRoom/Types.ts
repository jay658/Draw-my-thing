type Player = {
  sessionId: string,
  username: string,
  readyStatus: boolean,
  avatar: string
} 

type WaitingRoomErrorsT = {
  playersNotReady: string
}

export type {
  Player,
  WaitingRoomErrorsT
}