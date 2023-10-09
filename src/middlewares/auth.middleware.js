//FUNCIONES PARA AUTENTICACIÓN DE USUARIO

import userController from "../controllers/user.controller.js";

//Chequeo si el usuario está autenticado para acceder a la aplicación. Caso contrario, se envía al login.
export function isAuth(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/");
  }
}

//Chequeo si el usuario no está autenticado para enviarlo al login. Caso contrario, accede a la aplicación.
export function isGuest(req, res, next) {
  if (!req.user) {
    next();
  } else {
    res.redirect("/products");
  }
}

//AUTORIZACIÓN DE USUARIO
//Factory de Middewares para asignación de roles
export function authMiddleware(roles) {
  return async (req,res,next) => {
     const user = await userController.getById(req.user._id)
      if (user && roles.includes(user.role)) {
        next();
      } else {
        res.status(403).send({message: `Aceso no permitido. Se requiere ser ${roles.join(", ")}`})
      }
  }
}