import express, { NextFunction, Request, Response } from 'express'

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try{
    const url = process.env.HOME_WEBSITE
    res.send(url)
  } catch(err) {
    next(err)
  }
})

export default router