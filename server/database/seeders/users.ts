import { UserAttributes } from '../models/user'

export const deserializeUserInfo = (data: any): Partial <UserAttributes>=>({
  num_solved: data.num_solved,
  ac_easy: data.ac_easy,
  ac_medium: data.ac_medium,
  ac_hard: data.ac_hard
})

export const users: Partial<UserAttributes>[] = [
  {
    username: 'test',
    email: 'test@gmail.com'
  }
]