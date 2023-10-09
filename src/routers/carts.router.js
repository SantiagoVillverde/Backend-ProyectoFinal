//Importaciones
import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import purchaseController from "../controllers/purchase.controller.js";
import productController from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";
import userController from "../controllers/user.controller.js";

//Creación del router de carritos
const cartRouter = Router();

//Obtener todos los carritos
cartRouter.get("/", async (req, res) => {
  try {
    res.status(200).send(await cartController.get());
  } catch (err) {
    req.logger.error(`Error al obtener todos los carritos: ${err}`)
    res.status(500).send(`Error al obtener todos los carritos: ${err}`);
  }
});

//Obtener por ID
cartRouter.get("/:cid", async (req, res) => {
  try {
    res.status(200).send(await cartController.getById(req.params.cid));
  } catch (err) {
    req.logger.error(`Error al obtener el carrito por ID: ${err}`)
    res.status(500).send(`Error al obtener el carrito por ID: ${err}`);
  }
});

//Crear un nuevo carrito
cartRouter.post("/", async (req, res) => {
  try {
    res.status(201).send(await cartController.add(req.body));
  } catch (err) {
    req.logger.error(`Error al crear carrito: ${err}`)
    res.status(500).send(`Error al crear carrito: ${err}`);
  }
});

//Actualizar un carrito por su ID
cartRouter.put("/:cid", async (req, res) => {
  try {
    res.status(201).send(await cartController.update(req.params.cid, req.body));
  } catch (err) {
    req.logger.error(`Error al actualizar carrito por ID: ${err}`)
    res.status(500).send(`Error al actualizar carrito por ID: ${err}`);
  }
});

//Eliminar un carrito por su ID
cartRouter.delete("/:cid", async (req, res) => {
  try {
    res.status(200).send(await cartController.deleteAllProds(req.params.cid));
  } catch (err) {
    req.logger.error(`Error al eliminar carrito por ID: ${err}`)
    res.status(500).send(`Error al eliminar carrito por ID: ${err}`);
  }
});

//Agregar un producto al carrito por ID
cartRouter.post("/:cid/product/:pid", verifyToken, authMiddleware(["User", "Premium"]), async (req, res) => {
  const user = await userController.getById(req.user._id)
  const product = await productController.getById(req.params.pid)
  try {
    //Se valida que el usuario sea "User" o que, si es "Premium", el producto NO haya sido creado por el
    if (user.role === "User" || (user.role === "Premium" && product.owner !== user.email)){
      res.status(201).send(await cartController.addProdtoCart(req.params.cid, req.params.pid));
    } else {
      res.status(403).send("No tiene permisos para agregar este producto al carrito")
    }
  } catch (err) {
    req.logger.error(`Error al agregar el producto al carrito: ${err}`)
    res.status(500).send(`Error al agregar el producto al carrito: ${err}`);
  }
});

//Eliminar un producto del carrito por ID
cartRouter.delete("/:cid/product/:pid", verifyToken, async (req, res) => {
  try {
    res
      .status(201)
      .send(
        await cartController.deleteProdfromCart(req.params.cid, req.params.pid)
      );
  } catch (err) {
    req.logger.error(`Error al eliminar el producto del carrito: ${err}`)
    res.status(500).send(`Error al eliminar el producto del carrito: ${err}`);
  }
});

//Actualizar un producto del carrito por su ID
cartRouter.put("/:cid/product/:pid", verifyToken, async (req, res) => {
  try {
    res
      .status(201)
      .send(
        await cartController.updateProdfromCart(
          req.params.cid,
          req.params.pid,
          req.body
        )
      );
  } catch (err) {
    req.logger.error(`Error al actualizar el producto del carrito: ${err}`)
    res.status(500).send(`Error al actualizar el producto del carrito: ${err}`);
  }
});

//Finalizar la compra
cartRouter.post("/:cid/purchase", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    res.status(201).send(await purchaseController.endPurchase(req.params.cid, user))
  } catch (err) {
    req.logger.error(`Error interno al finalizar la compra: ${err}`)
    res.status(500).send(`Error interno al finalizar la compra: ${err}`);
  }
});

export default cartRouter;
