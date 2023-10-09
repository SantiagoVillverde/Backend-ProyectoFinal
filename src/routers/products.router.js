//Importaciones
import { Router } from "express";
import { io } from "../utils/server.util.js";
import productController from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import CustomErrors from "../utils/errors/CustomErrors.js";
import { generateProdErrorInfo } from "../utils/errors/errorInfo.js";
import ErrorIndex from "../utils/errors/ErrorIndex.js";
import { multerGenerator } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

//Creación del router de productos
const productRouter = Router();

//Obtener todos los productos
productRouter.get("/", async (req, res) => {
  try {
    res.status(200).send(await productController.get());
  } catch (err) {
    req.logger.error(`Error al obtener los productos: ${err}`);
    res.status(400).send(`Error al obtener los productos: ${err}`);
  }
});

//Obtener por ID
productRouter.get("/:pid", async (req, res) => {
  try {
    res.status(200).send(await productController.getById(req.params.pid));
  } catch (err) {
    req.logger.error(`Error al obtener el producto por ID: ${err}`);
    res.status(400).send(`Error al obtener el producto por ID: ${err}`);
  }
});

//Crear un nuevo producto (sólo siendo Admin o Premium) - CON MULTER
productRouter.post(
  "/",
  verifyToken,
  authMiddleware(["Premium", "Admin"]),
  multerGenerator("/public/data/images/products", ".jpg").single("thumbnail"),
  async (req, res) => {
    //Se obtiene el producto a crear y el usuario
    const product = req.body;
    product.thumbnail = req.file.filename;
    const user = req.user;
    try {
      //Si el usuario que creó el producto es "Premium", se asigna su mail al creador del producto. Caso contrario, queda "Admin" por defecto
      if (user.role === "Premium") {
        product.owner = user.email;
      }
      res.status(201).send(await productController.add(product));
      //Uso de socket para los productos en tiempo real
      io.emit("newProd", product);
    } catch (err) {
      CustomErrors.createError(
        "Product creation error",
        generateProdErrorInfo(product),
        "Campos incompletos",
        ErrorIndex.INCOMPLETE_DATA
      );
    }
  }
);

//Actualizar un producto por su ID
productRouter.put("/:pid", verifyToken, authMiddleware(["Premium", "Admin"]), async (req, res) => {
  try {
    console.log(req.body);
    res
      .status(201)
      .send(await productController.update(req.params.pid, req.body));
  } catch (err) {
    req.logger.error(`Error al actualizar el producto por ID: ${err}`);
    res.status(400).send(`Error al actualizar el producto por ID: ${err}`);
  }
});

//Eliminar un producto por su ID
productRouter.delete(
  "/:pid",
  verifyToken,
  authMiddleware(["Premium", "Admin"]),
  async (req, res) => {
    const user = req.user;
    const product = await productController.getById(req.params.pid);
    try {
      //Se valida que quien elimina el producto sea el "Admin" o que sea el mismo creador de ese producto
      if (
        user.role === "Admin" ||
        (user.role === "Premium" && user.email === product.owner)
      ) {
        res.status(200).send(await productController.delete(req.params.pid));
        //Uso de socket para los productos en tiempo real
        io.emit("deletedProd", req.params.pid);
      } else {
        res.status(403).send("No tiene permisos para eliminar este producto");
      }
    } catch (err) {
      req.logger.error(`Error al eliminar el producto por ID: ${err}`);
      res.status(401).send(`Error al eliminar el producto por ID: ${err}`);
    }
  }
);

export default productRouter;
