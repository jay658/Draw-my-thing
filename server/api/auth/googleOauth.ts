import { accessTokenCookieOptions, getGoogleInfo, getTokens, refreshTokenCookieOptions } from './Utils/GoogleUtils'
import express, { NextFunction, Request, Response } from 'express'

import db from '../../database/models'
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

const googleConfig = {
  client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
  grant_type: "authorization_code",
  client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT,
};

router.get("/", (req: Request, res: Response) => {
  res.redirect(redirectUrl);
});

router.get("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = {
      ...googleConfig,
      code: req.query.code,
    };

    const response = await getTokens(config)
    const { id_token, access_token, refresh_token } = response.data
    
    const { email, name }: { email: string, name: string } = (await getGoogleInfo(access_token)).data
    
    let user = await db.User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      user = await db.User.create({
        username: name,
        email,
      });
    }

    //Note cookies are automatic (assuming correct path), so in the future, if there is a cookie, we can access it in the req.cookies.accessToken
    res.cookie('googleAccessToken', access_token, accessTokenCookieOptions)

    res.cookie('googleRefreshToken', refresh_token, refreshTokenCookieOptions)
    
    /*
    TO REFRESH THE ACCESS TOKEN:
    the refreshToken can be found in the req.cookies.refreshToken. REFRESHTOKEN DOESNT EXPIRE BUT ACCESSTOKEN DOES
    THIS CAN ONLY BE FOUND IF THE CALL STARTS WITH /API. If we need to change this, we can update the path in the cookie options

    const response = await axios.post('https://oauth2.googleapis.com/token', {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const { access_token } = response.data;

    -store the new accessToken as a cookie-
    */

    //Need to figure out how to do this dynamically for when it is deployed
    res.redirect(`http://localhost:5173/`)
  } catch (e) {
    console.log(`Failed to authenticate user with error: ${e.message}`)
    throw new Error(`The authentication failed with error: ${e.message}`)
  }
});

export default router