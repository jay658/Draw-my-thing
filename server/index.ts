import * as server from "./app"

import db from "./database/models"
import express from 'express';
import { problems } from "./database/seeders/problems"
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
    await db.sequelize.sync({ force:true })
    problems.map(problem=>{
      db.Problem.create(problem)
    })
    users.map(user=>{
      db.User.create(user)
    })
    console.log("db connected")
    // if (process.env.SEED === "true") {
    //   await seed();
    // } else {
    //   await db.sync();
    // } 
  } catch (ex) {
    console.log(ex);
  }
};

init();