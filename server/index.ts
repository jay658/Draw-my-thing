import * as server from "./app"

import db from "./database/models"
import express from 'express';

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
    db.sequelize.sync({ force:true })
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