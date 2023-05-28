import express, { NextFunction, Request, Response } from 'express'

import axios from 'axios';
import db from '../database/models'

const router = express.Router();


const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
const redirectUrl = process.env.GITHUB_OAUTH_REDIRECT;
const scope = 'user'

router.get("/", (req: Request, res: Response) => {
  const gitHubAuthorizationLink = 'https://github.com/login/oauth/authorize'
  const params = `?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope}`
  
  res.redirect(gitHubAuthorizationLink+params);
});

router.get("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = `?client_id=${clientId}&client_secret=${clientSecret}&code=${req.query.code}`
    let response = await axios.post('https://github.com/login/oauth/access_token'+params,{},{
      headers: {
        "Accept": "application/json"
      }
    });
    
    response = await axios.get(
      `https://api.github.com/user`,{
        headers: {
          Authorization: `Bearer ${response.data.access_token}`
        }
      }
    );
    const username: string = response.data.login;
  
    let user = await db.User.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      user = await db.User.create({
        username: username,
      });
    }
    
    res.send("LOGGED IN USER");
  } catch (e) {
    next(e);
  }
});

export default router