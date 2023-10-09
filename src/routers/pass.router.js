//Importaciones
import { Router } from "express";
import { passRecovController } from "../controllers/passrecov.controller.js";

//Creación del router de contraseñas
const passRouter = Router();

//Inicio del proceso de recuperación de contraseña
passRouter.post("/", async (req,res)=>{
    try {
        res.status(201).send(await passRecovController.sendMail(req.body.email));
    } catch (err) {
        req.logger.fatal(`Error interno al enviar el mail para restablecimiento de contraseña: ${err}`);
        res.status(500).send(`Error interno al enviar el mail para restablecimiento de contraseña: ${err}`)
    }
})

//Actualización de la contraseña
passRouter.post("/newpass", async (req,res)=>{
    try {
        res.status(201).send(await passRecovController.updatePass(req.query.token, req.body.newPass, req.body.repeatNewPass));
    } catch (err) {
        req.logger.fatal(`Error interno al restablecer la contraseña: ${err}`);
        res.status(500).send(`Error interno al restablecer la contraseña: ${err}`)
    }
})

export default passRouter;