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
  currentWord: string

  elapsedSeconds: number = 0
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
    this.currentWord = ""
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
    this.elapsedSeconds = 0
    io.to(this.roomName).emit('start_timer')
    if(!this.gameClock){
      this.gameClock = setInterval(() => {
        this.elapsedSeconds += 1
        if(this.elapsedSeconds % 5 === 0) io.to(this.roomName).emit('update_timer', this.TOTAL_TIME - this.elapsedSeconds)
        if(this.elapsedSeconds > this.TOTAL_TIME) {
          clearInterval(this.gameClock as any)
          this.gameClock = null
        }
      }, 1000)
    }
  }

  startEndOfRoundScoreboardTimer(io: Server){
    if(!this.gameClock){
      this.elapsedSeconds = 0
      this.gameClock = setInterval(() => {
        this.elapsedSeconds += 5
        if(this.elapsedSeconds >= 5) {
          console.log('emiting to rooms', this.roomName)
          io.to(this.roomName).emit("starting_next_round")
          clearInterval(this.gameClock as any)
          this.gameClock = null
        }
      }, 5000)
    }
  }

  setTimePenalty(io: Server){
    if(this.TOTAL_TIME - this.elapsedSeconds <= 10) return
    if(this.elapsedSeconds + 20 >= this.TOTAL_TIME) this.elapsedSeconds = this.TOTAL_TIME - 10
    else this.elapsedSeconds += this.TIME_PENALTY
    io.to(this.roomName).emit('update_timer', this.TOTAL_TIME - this.elapsedSeconds)
  }
}

export type SessionT = Record<string, {member: Member, timerId: NodeJS.Timeout}>
export type GamesT = Record<string, Game>