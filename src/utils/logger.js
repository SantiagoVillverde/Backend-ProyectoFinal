//Importación de Winston
import winston from "winston";

//Creación de niveles y colores custom para logger
const customLoggerOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "yellow",
    warning: "magenta",
    info: "blue",
    http: "gray",
    debug: "white",
  },
};

//Logger para entorno de desarrollo
export const devLogger = winston.createLogger({
  levels: customLoggerOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLoggerOptions.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

//Logger para entorno de producción
export const prodLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLoggerOptions.colors }),
          winston.format.simple()
        ),
      }),
    new winston.transports.File({ filename: "./errors.log", level: "error" }),
  ],
});
