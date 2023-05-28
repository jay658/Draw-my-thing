import express, { NextFunction, Request, Response } from 'express'

import axios from 'axios';
import db from '../database/models'
import { google } from 'googleapis'

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT,
)

const redirectUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['email', 'profile']
})

router.get("/", (req: Request, res: Response) => {
  res.redirect(redirectUrl);
});

router.get("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = {
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
      grant_type: "authorization_code",
      code: req.query.code,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT,
    };
    let response = await axios.post(
      "https://oauth2.googleapis.com/token",
      config
    );
    response = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.data.access_token}`
    );
    const email: string = response.data.email;
  
    let user = await db.User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      user = await db.User.create({
        username: response.data.name,
        email,
      });
    }
    console.log(email, user)
    res.send("LOGGED IN USER");
  } catch (e) {
    next(e);
  }
});

export default router