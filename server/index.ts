import * as appServer from "./app"

import { Server } from 'socket.io'
import { createServer } from 'http'
import db from "./database/models"
import express from 'express';
import { leetcodeInfo } from "./database/seeders/index"
import socketCommands from "./socketCommands";
import { users } from "./database/seeders/users";

export const app = appServer.app
const PORT = process.env['PORT'] || 5173

const init = async () => {
  if (!process.env['VITE']) {
    const frontendFiles = process.cwd() + '/dist'
    app.use(express.static(frontendFiles))
    app.get('/*', (_, res) => {
      res.send(frontendFiles + '/index.html')
    })
    const httpServer = createServer(app)

    const io = new Server(httpServer, {
      cors: {
        origin: `http://localhost:${PORT}`
      }
    })

    io.on('connection', socketCommands(io))
    
    httpServer.listen(PORT)
  }
  try {
    console.log(`server connected on port ${PORT}`)
    if(process.env.SEED === "true"){
      console.log('reset database')
      await db.sequelize.sync({force: true})
      await Promise.all(
        leetcodeInfo.problems.map((problem) => db.Problem.create(problem))
      )
      const testUser = await db.User.create({
        ...users[0],
        ...leetcodeInfo.userInfo
      })
      await Promise.all(
        leetcodeInfo.problemInfo.map(problem => db.ProblemInfo.create({
          user_id:testUser.id,
          ...problem
        }))
      )
    }else await db.sequelize.sync()

    console.log("db connected")
  } catch (ex) {
    console.log(ex);
  }
};

init();