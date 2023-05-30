import { User } from '../../Store/RTK/userSlice'
import { rest } from 'msw'

export const handlers = [
  rest.get('http://localhost:5173/api/users', (_, res, ctx) => {
    const testUser: Partial<User> = {
      id: '1',
      username: 'test user'
    }

    return res(
      ctx.status(200),
      ctx.json([testUser])
    )
  }),

  rest.get('http://localhost:5173/api/auth', (_, res, ctx) => {
    const testAuthUser: Partial<User> = {
      id: '0',
      username: 'test auth user'
    }

    return res(
      ctx.status(200),
      ctx.json(testAuthUser)
    )
  })
]