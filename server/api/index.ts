import express, {NextFunction, Request, Response} from 'express'

import authRouter from './auth/auth'
import githubOauthRouter from './auth/githubOauth'
import googleOauthRouter from './auth/googleOauth'
import userRouter from './users'
import websiteRouter from './website'

const router = express.Router();

router.use('/users', userRouter)
router.use('/googleOauth', googleOauthRouter)
router.use('/githubOauth', githubOauthRouter)
router.use('/auth', authRouter)
router.use('/website', websiteRouter)

router.use((req: Request, res: Response, next: NextFunction) => {
  const error: Error & { status?: number } = new Error('Not Found');
  error.status = 404;
  next(error);
});

export default router