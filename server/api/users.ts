import express, { NextFunction, Request, Response } from 'express'

import { UserAttributes } from '../database/models/user'
import db from '../database/models';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try{
    const users: UserAttributes[] = await db.User.findAll()
    res.send(users)
  } catch(err) {
    next(err)
  }
})

export default router