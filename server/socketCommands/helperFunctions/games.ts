import { GamesT, Game, gameInfo } from '../types'

export const games: GamesT = {}

export const addGame = (gameInfo: gameInfo) => {
  games[gameInfo.name] = new Game(gameInfo)
}