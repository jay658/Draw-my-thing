import * as server from "./app"

import db from "./database/models"
import express from 'express';
import { leetcodeInfo } from "./database/seeders/index"
import { users } from "./database/seeders/users";

export const app = server.app

const init = async () => {
  if (!process.env['VITE']) {
    const frontendFiles = process.cwd() + '/dist'
    app.use(express.static(frontendFiles))
    app.get('/*', (_, res) => {
      res.send(frontendFiles + '/index.html')
    })
    app.listen(process.env['PORT'])
  }
  try {
    console.log("server connected")
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