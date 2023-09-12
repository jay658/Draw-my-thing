import { avatarsMap } from "./AvatarSelect"

type JoinScreenErrorsT = {
  roomNotFound: string,
  roomNameTaken: string, 
  roomFull: string
}

type AvatarType = keyof typeof avatarsMap

export type {
  JoinScreenErrorsT,
  AvatarType
}