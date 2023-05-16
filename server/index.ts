import * as server from "./app"

import express from 'express';

export const app = server.app
// const db = require("./database")
// const client = db.client

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
    console.log("hello")
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