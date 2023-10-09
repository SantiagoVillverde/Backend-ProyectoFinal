//Importaciones
import ErrorIndex from "../utils/errors/ErrorIndex.js";

//Creación de middleware para manejo de errores
const errorMiddleware = (err, req, res, next) => {
  switch (err.code) {
    //Caso de error por tipo inválido de datos
    case ErrorIndex.INVALID_TYPE:
      res.status(400).send({ status: "error", error: err.name });
      break;
    //Caso de error interno de DB
    case ErrorIndex.DATABASE_ERROR:
      res.status(500).send({ status: "error", error: err.name });
      break;
    //Caso de error en el routing
    case ErrorIndex.ROUTING_ERROR:
      res.status(404).send({ status: "error", error: err.name });
      break;
    //Caso de error en campos incompletos
    case ErrorIndex.INCOMPLETE_DATA:
      res.status(400).send({ status: "error", error: err.name });
      break;
    //Caso por defecto
    default:
      res.status(403).send({ status: "error", error: err.name });
      break;
  }
};

export default errorMiddleware;

