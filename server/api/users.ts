import express, { NextFunction, Request, Response } from 'express'

import { User } from '../database/index';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try{
    const users = await User.findAll()
    res.send(users)
  } catch(err) {
    next(err)
  }
})

export default router