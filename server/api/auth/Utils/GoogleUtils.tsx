import { CookieOptions } from 'express'
import axios from 'axios'
import { google } from 'googleapis'

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

const getTokens = async (config: typeof googleConfig): Promise<any> => {
  return axios.post(
    "https://oauth2.googleapis.com/token", 
    config
  );
}

const getUserInfo = async (accessToken: string): Promise<any> => {
  return axios.get(
    `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
  );
}

const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true, //this makes it prevent client-side access
  secure: false, //true if we want https only
  maxAge: 3600000, //cookie expiration time in milliseconds, 1 hour in this case
  sameSite: 'lax', //makes the cookie only valid on this site
  path: '/api', //this option determines when the cookie will be sent. In this case, it will only be sent if the URL starts with '/api'
}

const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true, //this makes it prevent client-side access
  secure: false, //true if we want https only
  maxAge: 365 * 24 * 60 * 60 * 1000, //cookie expiration time in milliseconds, 1 year in this case
  sameSite: 'lax', //makes the cookie only valid on this site
  path: '/api', //this option determines when the cookie will be sent. In this case, it will only be sent if the URL starts with '/api'
}

export {
  oauth2Client,
  redirectUrl,
  googleConfig, 
  getTokens,
  getUserInfo,
  accessTokenCookieOptions,
  refreshTokenCookieOptions
}