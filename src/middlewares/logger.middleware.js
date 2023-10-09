//Importaciones
import { devLogger, prodLogger } from "../utils/logger.js";
import { appConfig } from "../config/env.config.js";

//Definición del entorno a trabajar
const environment = appConfig.environment;

//Creación de middleware para generación de logs según entorno
export const addEnvLogger = async (req, res, next) => {
  environment === "development"
    ? (req.logger = devLogger)
    : (req.logger = prodLogger);
  next();
};
