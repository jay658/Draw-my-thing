import express, { NextFunction, Request, Response } from 'express'

import { UserAttributes } from '../../database/models/user'
import { accessTokenCookieOptions } from './Utils/GithubUtils';
import db from '../../database/models/'
import { getGitHubInfo } from './Utils/GithubUtils'
import { getGoogleInfo } from './Utils/GoogleUtils';

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { googleAccessToken, gitHubAccessToken } = req.cookies

    let user: Partial<UserAttributes> | null = null
    
    if(googleAccessToken) {
      const { email }: { email: string, name: string } = (await getGoogleInfo(googleAccessToken)).data
      user = await db.User.findOne({
        where: {
          email: email,
        },
      });
    }else if (gitHubAccessToken) {
      const { login: username } = (await getGitHubInfo(gitHubAccessToken)).data;
      user = await db.User.findOne({
        where: {
          username,
        },
      })
    }

    res.send(user)
  }catch(e){
    next(e)
  }
});

router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
  try{
    res.clearCookie('googleAccessToken', accessTokenCookieOptions)
    res.clearCookie('gitHubAccessToken', accessTokenCookieOptions)
    res.send('Logged out user.')
  }catch(e){
    next(e)
  }
});

export default router