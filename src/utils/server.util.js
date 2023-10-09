//Importaciones
import { Server } from "socket.io";
import express from "express";
import { appConfig } from "../config/env.config.js";

//Montaje del servidor en express y el socket para permitir exportar el socket a otros módulos.
const app = express();
const httpServer = app.listen(appConfig.port, () => {
    console.log(`Listening on port ${appConfig.port}`);
  });
const io = new Server(httpServer);

export {app, io};