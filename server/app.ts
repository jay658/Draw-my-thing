import express from 'express';

export const app = express();

app.use(express.json())
app.get('/api/test', (_, res) => 
    res.json("Hello")
)
