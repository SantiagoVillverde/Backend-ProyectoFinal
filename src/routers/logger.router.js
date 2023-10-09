//Importación de router
import { Router } from "express";

//Creación de Router para testeo de Winston Logger
const loggerRouter = Router();

//Generación de endpoint para testeo de logs
loggerRouter.get("/", (req, res) => {
  try {
    req.logger.fatal("Esto es un error fatal");
    req.logger.error("Esto es un error común");
    req.logger.warning("Esto es una advertencia");
    req.logger.info("Esto es una información");
    req.logger.http("Esto es un informe de http");
    req.logger.debug("Esto es un informe de debug");
    res.send({ message: "Prueba de loggers" });
  } catch (error) {
    req.logger.fatal("Error interno de carga de loggers");
    res.status(500).send("ERROR: ", error)
  }
});

export default loggerRouter;
