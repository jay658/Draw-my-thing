import express, { NextFunction, Request, Response } from 'express'

import { User } from '../../database/index'
import { getGitHubInfo } from './Utils/GithubUtils'
import { getGoogleInfo } from './Utils/GoogleUtils';

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { googleAccessToken, gitHubAccessToken } = req.cookies

    let user: Partial<typeof User>|null = {}
    
    if(googleAccessToken) {
      const { email }: { email: string, name: string } = (await getGoogleInfo(googleAccessToken)).data
      user = await User.findOne({
        where: {
          email: email,
        },
      });
    }else if (gitHubAccessToken) {
      const { login: username } = (await getGitHubInfo(gitHubAccessToken)).data;
      user = await User.findOne({
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

export default router