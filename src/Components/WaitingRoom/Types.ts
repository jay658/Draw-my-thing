type Player = {
  sessionId: string,
  username: string,
  readyStatus: boolean,
  avatar: string
  score: number,
  pointsThisRound: number,
} 

type WaitingRoomErrorsT = {
  playersNotReady: string
}

export type {
  Player,
  WaitingRoomErrorsT
}