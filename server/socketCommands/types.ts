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

export type gameInfo = {
  name: string,
  players: Member[],
  wordbank: string[],
}

export class Game {
  name: string
  players: Member[]
  wordbank: string[]
  scoreboard: number[]

  constructor(gameInfo: gameInfo){
    this.name = gameInfo.name;
    this.players = gameInfo.players;
    this.wordbank = gameInfo.wordbank
    this.scoreboard = new Array(this.players.length).fill(0)
  }

  getThreeWords(){
    const bank = this.wordbank
    const gameWordSet = new Set<string>();
  
    while(gameWordSet.size < 3){
      const word = bank[Math.floor(Math.random() * bank.length)]
      gameWordSet.add(word)
    }

    return [...gameWordSet]
  }
}
export type SessionT = Record<string, {member: Member, timerId: NodeJS.Timeout}>
export type GamesT = Record<string, Game>