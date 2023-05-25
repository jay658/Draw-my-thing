import express, { Request, Response } from 'express';

import router from './api';

export const app = express();

app.use(express.json())

app.use('/api', router)

app.get('/api/test', (req: Request, res: Response) => 
    res.json("Hello")
)


app.use((err: any, req: Request, res: Response) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});