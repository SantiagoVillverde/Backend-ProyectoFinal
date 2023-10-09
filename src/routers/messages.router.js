//Importaciones
import { Router } from "express";
import messageController from "../controllers/message.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

//Creación del router de mensajes
const messageRouter = Router();

//Obtener todos los mensajes
messageRouter.get("/", async (req, res) => {
  try {
    res.status(200).send(await messageController.get());
  } catch (err) {
    req.logger.error(`Error de servidor al obtener los mensajes: ${err}`);
    res.status(500).send(`Error de servidor al obtener los mensajes: ${err}`);
  }
});

//Postear un nuevo mensaje
messageRouter.post("/", authMiddleware(["User"]), async (req, res) => {
  try {
    res.status(201).send(await messageController.add(req.body));
  } catch (err) {
    req.logger.error(`Error del servidor al postear nuevo mensaje: ${err}`);
    res.status(500).send(`Error del servidor al postear nuevo mensaje: ${err}`);
  }
});

//Eliminar un mensaje por su ID
messageRouter.delete("/:mid", async (req, res) => {
  try {
    res.status(200).send(await messageController.delete(req.params.mid));
  } catch (err) {
    req.logger.error(
      `Error del servidor al eliminar un mensaje por ID: ${err}`
    );
    res
      .status(500)
      .send(`Error del servidor al eliminar un mensaje por ID: ${err}`);
  }
});

export default messageRouter;
