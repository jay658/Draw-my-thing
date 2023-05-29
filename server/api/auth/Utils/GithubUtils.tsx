import { CookieOptions } from 'express'
import axios from 'axios'

const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true, //this makes it prevent client-side access
  secure: false, //true if we want https only
  maxAge: 3600000, //cookie expiration time in milliseconds, 1 hour in this case
  sameSite: 'lax', //makes the cookie only valid on this site
  path: '/api', //this option determines when the cookie will be sent. In this case, it will only be sent if the URL starts with '/api'
}

const getAccessToken = async(params: string): Promise<any> => {
  return axios.post('https://github.com/login/oauth/access_token'+params,{},{
    headers: {
      "Accept": "application/json"
    }
  })
}

const getGitHubInfo = async(accessToken: string): Promise<any> => {
  return axios.get(
    `https://api.github.com/user`,{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}

export {
  accessTokenCookieOptions,
  getAccessToken,
  getGitHubInfo
}