import { Server } from "socket.io"

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

type Player = Member & {
  score: number,
  pointsThisRound: number,
}

export type gameInfo = {
  name: string,
  players: Member[],
  wordbank: string[],
  lines?: number[][],
  drawerIdx?: number,
  round?: number,
  roomName: string
}

export class Game {
  name: string
  players: Player[]
  wordbank: string[]
  scoreboard: number[]
  lines: number[][]
  drawerIdx: number
  round: number
  guessOrder: string[]
  gameClock: NodeJS.Timeout | number | null
  roomName: string

  elapsedTime: number = 0
  TOTAL_TIME = 30
  TIME_PENALTY = 10
  
  constructor(gameInfo: gameInfo){
    this.name = gameInfo.name;
    this.players = gameInfo.players.map(player => ({
      ...player, 
      score: 0,
      pointsThisRound: 0
    }))
    this.wordbank = gameInfo.wordbank
    this.scoreboard = new Array(this.players.length).fill(0)
    this.lines = []
    this.drawerIdx = 0
    this.round = 1
    this.guessOrder = []
    this.gameClock = null
    this.roomName = gameInfo.roomName
  }

  getThreeWords(){
    const bank = this.wordbank
    const gameWordSet = new Set<string>();
  
    while(gameWordSet.size < 3){
      const word = bank[Math.floor(Math.random() * bank.length)]
      if(!gameWordSet.has(word)){
        bank.filter(bankWord => bankWord === word)
      }
      gameWordSet.add(word)
    }
    
    return [...gameWordSet]
  }

  startTimer(io: Server){
    this.elapsedTime = 0
    io.to(this.roomName).emit('start_timer')
    this.gameClock = setInterval(() => {
      this.elapsedTime += 1
      if(this.elapsedTime % 5 === 0) io.to(this.roomName).emit('update_timer', this.TOTAL_TIME - this.elapsedTime)
      if(this.elapsedTime > this.TOTAL_TIME) clearInterval(this.gameClock as any)
    }, 1000)
  }

  setTimePenalty(io: Server){
    if(this.TOTAL_TIME - this.elapsedTime <= 10) return
    if(this.elapsedTime + 20 >= this.TOTAL_TIME) this.elapsedTime = this.TOTAL_TIME - 10
    else this.elapsedTime += this.TIME_PENALTY
    io.to(this.roomName).emit('update_timer', this.TOTAL_TIME - this.elapsedTime)
  }
}

export type SessionT = Record<string, {member: Member, timerId: NodeJS.Timeout}>
export type GamesT = Record<string, Game>