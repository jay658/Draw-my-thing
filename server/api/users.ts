import express, { NextFunction, Request, Response } from 'express'

import { User } from '../database/models/user';
import db from '../database/models';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try{
    console.log(req.cookies)
    const users = await User.findAllUser()
    res.send(users)
  } catch(err) {
    next(err)
  }
})

export default router