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

type Phase = "Pick_Word" | "End_Of_Round" | "Drawing"

export type gameInfo = {
  name: string,
  players: Member[],
  phase?: Phase,
  wordbank: string[],
  lines?: number[][],
  drawerIdx?: number,
  round?: number,
  roomName: string
}


export class Game {
  name: string
  players: Player[]
  currentPhase: Phase
  wordbank: string[]
  scoreboard: number[]
  lines: number[][]
  drawerIdx: number
  round: number
  guessOrder: string[]
  gameClock: NodeJS.Timeout | number | null
  roomName: string
  elapsedSeconds: number = 0
  revealedLettersSet: Set <number> = new Set()
  numberLettersRevealedNextTick: number = 0
  currentWord = ""
  
  inProgress: boolean = true
  TOTAL_TIME = 30
  TIME_PENALTY = 10
  NUM_SECONDS_TO_REVEAL_LETTERS = Math.floor(this.TOTAL_TIME/10)
  
  constructor(gameInfo: gameInfo){
    this.name = gameInfo.name;
    this.players = gameInfo.players.map(player => ({
      ...player, 
      score: 0,
      pointsThisRound: 0
    }))
    this.currentPhase = "Pick_Word"
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
    let bank = this.wordbank
    const wordChoices = []
    while(wordChoices.length < 3){
      const word = bank[Math.floor(Math.random() * bank.length)]
      bank = bank.filter(bankword => bankword !== word)
      wordChoices.push(word)
    }
    this.wordbank = bank
    return wordChoices
  }

  revealLetters(){
    this.numberLettersRevealedNextTick += this.currentWord.length/10
    let amountLettersToReveal = Math.floor(this.numberLettersRevealedNextTick)
    this.numberLettersRevealedNextTick -= amountLettersToReveal
    
    while(amountLettersToReveal > 0){
      const idxToReveal = Math.floor(Math.random() * this.currentWord.length)
      if(!this.revealedLettersSet.has(idxToReveal)){
        this.revealedLettersSet.add(idxToReveal)
        amountLettersToReveal --
      }
    }
  }
  
  startTimer(io: Server){
    this.elapsedSeconds = 0
    io.to(this.roomName).emit('start_timer')
    if(!this.gameClock){
      this.gameClock = setInterval(() => {
        this.elapsedSeconds += 1
        if(this.elapsedSeconds % 5 === 0) {
          io.to(this.roomName).emit('update_timer', this.TOTAL_TIME - this.elapsedSeconds)
        }
        if(this.elapsedSeconds % this.NUM_SECONDS_TO_REVEAL_LETTERS === 0
            && this.TOTAL_TIME - this.elapsedSeconds >= 10
          ){
          this.revealLetters()
          io.to(this.roomName).emit('show_more_letters', [...this.revealedLettersSet])
        }
        if(this.elapsedSeconds > this.TOTAL_TIME) {
          io.to(this.roomName).emit("end_of_round_to_client")
          this.currentPhase = "End_Of_Round"
          clearInterval(this.gameClock as any)
          this.gameClock = null
          this.startEndOfRoundScoreboardTimer(io)
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
          io.to(this.roomName).emit("starting_next_round")
          this.nextDrawer(io)
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

  nextDrawer(io: Server){
    let nextDrawerIdx = this.drawerIdx, nextRound = this.round, players = this.players

    if(nextDrawerIdx === players.length - 1){
      nextDrawerIdx = 0
      nextRound++
    }else nextDrawerIdx++
    
    players.forEach(player => {
      player.score += player.pointsThisRound
      player.pointsThisRound = 0
    })
    
    this.resetForNextRound(nextDrawerIdx, nextRound)
    
    if(this.gameClock) clearInterval(this.gameClock)
    io.to(this.roomName).emit('update_drawer_and_round', { drawerIdx: nextDrawerIdx, round: nextRound, players })
  }
  
  resetForNextRound(nextDrawerIdx: number, nextRound: number){
    this.lines = []
    this.drawerIdx = nextDrawerIdx
    this.round = nextRound
    this.guessOrder = []
    this.currentWord = ""
    this.numberLettersRevealedNextTick = 0
    this.revealedLettersSet = new Set()
    this.elapsedSeconds = 0
  }
}

export type SessionT = Record<string, {member: Member, timerId: NodeJS.Timeout}>
export type GamesT = Record<string, Game>