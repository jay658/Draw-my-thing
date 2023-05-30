import { CookieOptions } from 'express'
import axios from 'axios'

type googleConfigType = {
  client_id: string | undefined,
  grant_type: string ,
  client_secret: string | undefined,
  redirect_uri: string | undefined,
};

const getTokens = async (config: googleConfigType): Promise<any> => {
  return axios.post(
    "https://oauth2.googleapis.com/token", 
    config
  );
}

const getGoogleInfo = async (accessToken: string): Promise<any> => {
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
  getTokens,
  getGoogleInfo,
  accessTokenCookieOptions,
  refreshTokenCookieOptions
}