import express, { NextFunction, Request, Response } from 'express';

import router from './api';

export const app = express();

app.use(express.json())

app.use('/api', router)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});