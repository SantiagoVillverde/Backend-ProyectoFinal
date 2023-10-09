//Se crea una clase generadora de errores
export default class CustomErrors {
    //Se define una función estática, pasando como parámetros un nombre, la causa, un mensaje y un código de error
  static createError(name = "Error", cause, message, code = 1) {
    const error = new Error(message, { cause });
    error.name = name;
    error.code = code;
    throw error;
  }
}