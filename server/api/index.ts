import express, {NextFunction, Request, Response} from 'express'

import githubOauthRouter from './githubOauth'
import googleOauthRouter from './googleOauth'
import userRouter from './users'

const router = express.Router();

router.use('/users', userRouter)
router.use('/googleOauth', googleOauthRouter)
router.use('/githubOauth', githubOauthRouter)

router.use((req: Request, res: Response, next: NextFunction) => {
  const error: Error & { status?: number } = new Error('Not Found');
  error.status = 404;
  next(error);
});

export default router