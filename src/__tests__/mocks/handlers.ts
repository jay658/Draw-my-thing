import { User } from '../../Store/RTK/userSlice'
import { rest } from 'msw'
import { website } from '../../Store/RTK/'

export const handlers = [
  rest.get(`${website}/api/users`, (_, res, ctx) => {
    const testUser: Partial<User> = {
      id: '1',
      username: 'test user'
    }

    return res(
      ctx.status(200),
      ctx.json([testUser])
    )
  }),

  rest.get(`${website}/api/auth`, (_, res, ctx) => {
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