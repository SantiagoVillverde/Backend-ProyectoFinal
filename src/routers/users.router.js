//Importaciones
import { Router } from "express";
import passport from "passport";
import userController from "../controllers/user.controller.js";
import { multerGenerator } from "../middlewares/multer.middleware.js";
import { generateToken, verifyToken } from "../middlewares/jwt.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import cartController from "../controllers/cart.controller.js";

//Creación del router de usuarios
const userRouter = Router();

//Obtención de todos los usuarios
userRouter.get("/", async(req, res)=>{
  try {
    res.status(200).send(await userController.get());
  } catch (err) {
    res.status(500).send(`Error interno del servidor al obtener los usuarios: ${err}`)
  }
})

//Creación de un nuevo usuario por medio del registro con passport
userRouter.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "/registererror",
    session: false,
  }),
  async (req, res) => {
    try {
      res.redirect("/");
    } catch (error) {
      req.logger.fatal(`Error interno de ruteo al registrarse: ${err}`);
      res.status(500).send(`Error interno de ruteo al registrarse: ${err}`);
    }
  }
);

//Error de registro con passport
userRouter.get("/registererror", (req, res) => {
  req.logger.error("Error de estrategia al registrarse");
  res.send({ error: "Error de estrategia al registrarse" });
});

//Uso de passport para autenticación en inicio de sesión.
userRouter.post(
  "/auth",
  passport.authenticate("login", {
    failureRedirect: "/loginerror",
    session: false,
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res
          .status(400)
          .send({ status: "error", error: "Credenciales inválidas" });
      }
      const user = req.user;
      delete user.password;
      req.logger.debug(`Asignado usuario a request: ${user}`)
      let token = generateToken({ user });
      res.cookie("jwToken", token, { httpOnly: true, });
      req.logger.debug(`Token generado y almacenado en cookie: ${req.cookies}`)
      res.redirect("/");
    } catch (err) {
      req.logger.error(`Error interno de ruteo al iniciar sesión: ${err}`);
      res.status(500).send(`Error interno de ruteo al iniciar sesión: ${err}`);
    }
  }
);

//Inicio de sesión con GitHub
userRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

userRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      res.redirect("/");
    } catch (err) {
      req.logger.error(`Error interno al iniciar sesión con GitHub: ${err}`);
      res
        .status(500)
        .send(`Error interno al iniciar sesión con GitHub: ${err}`);
    }
  }
);

//Error de inicio de sesión con passport
userRouter.get("/loginerror", (req, res) => {
  req.logger.fatal("Error de estrategia al iniciar sesión");
  res.send({ error: "Error de estrategia al iniciar sesión" });
});

//Cierre de sesión
userRouter.post("/logout", verifyToken, async (req, res) => {
  try {
    const uid = req.user._id;
    const user = await userController.getById(uid);
    user.last_connection = new Date();
    await userController.update(uid, user);
    res.clearCookie("jwToken");
    res.status(201).redirect("/");
  } catch (err) {
    req.logger.error(`Error interno al cerrar sesión: ${err}`);
    res.status(500).send(`Error interno al cerrar sesión: ${err}`);
  }
});

//Cambio de rol de usuario (User-Premium)
userRouter.get("/premium/:uid", verifyToken, async (req, res) => {
  try {
    const user = await userController.changeRole(req.params.uid);
    req.user.role = user.role;
    res.redirect("/");
  } catch (err) {
    req.logger.error(`Error al cambiar el rol del usuario: ${err}`);
    res.status(500).send(`Error al cambiar el rol del usuario: ${err}`);
  }
});

//Carga de documentos con Multer
userRouter.post(
  "/:uid/documents", verifyToken,
  multerGenerator("/public/data/documents", ".pdf").fields([
    { name: "idFile", maxCount: 1 },
    { name: "addressCompFile", maxCount: 1 },
    { name: "accountCompFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const user = await userController.getById(req.params.uid);
      if (req.files.idFile) {
        user.documents.push({
          name: "ID Document",
          reference: req.files.idFile[0].path,
        });
      }
      if (req.files.addressCompFile) {
        user.documents.push({
          name: "Address Document",
          reference: req.files.addressCompFile[0].path,
        });
      }
      if (req.files.accountCompFile) {
        user.documents.push({
          name: "Account Document",
          reference: req.files.accountCompFile[0].path,
        });
      }
      await userController.update(req.params.uid, user);
      req.logger.info("Archivos subidos correctamente!");
      res.status(201).send("Archivos subidos correctamente!");
    } catch (error) {
      req.logger.fatal(`Error interno al subir documentos: ${err}`);
      res.status(500).send(`Error interno al subir documentos: ${err}`);
    }
  }
);

//Carga de imagen de perfil con Multer
userRouter.post(
  "/:uid/profImg", verifyToken, 
  multerGenerator("/public/data/images/profiles", ".jpg").single("profImg"),
  async (req, res) => {
    try {
      const user = await userController.getById(req.params.uid);
      user.img = req.file.filename;
      await userController.update(req.params.uid, user);
      req.logger.info("Imagen de perfil actualizada!");
      res.status(201).send("Imagen de perfil actualizada!");
    } catch (err) {
      req.logger.fatal(`Error interno al actualizar la foto de perfil: ${err}`);
      res
        .status(500)
        .send(`Error interno al actualizar la foto de perfil: ${err}`);
    }
  }
);

//Eliminación de usuario por inactividad
userRouter.delete(
  "/:uid", verifyToken, authMiddleware(["User", "Premium"]), async (req, res) => {
    try {
      //Se obtiene el usuario y se verifica el tiempo desde su última conexión expresado en minutos
      const userToDelete = await userController.getById(req.params.uid);
      const timeFromLastConnect = (Date.now() - userToDelete.last_connection) / 60000;
      if(timeFromLastConnect <= 30){
        req.logger.error(`No puede eliminarse el usuario por no haber cumplido el tiempo de inactividad`)
        res.status(204).send(`No puede eliminarse el usuario por no haber cumplido el tiempo de inactividad`)
      } else {
        await cartController.delete(userToDelete.cart);
        await userController.delete(userToDelete._id)
        req.logger.info(`Usuario eliminado: ${userToDelete._id}`)
        res.status(200).send(`Tiempo desde la última conexión: ${timeFromLastConnect}`)
      }
    } catch (err) {
      req.logger.fatal(`Error interno al eliminar usuario: ${err}`);
      res
        .status(500)
        .send(`Error interno al eliminar usuario: ${err}`);
    }
  }
)

export default userRouter;
