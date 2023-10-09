//Importaciones
import { Router } from "express";
import { generateProducts } from "../utils/mockProductGenerator.util.js";
import productController from "../controllers/product.controller.js";
import CustomErrors from "../utils/errors/CustomErrors.js";
import ErrorIndex from "../utils/errors/ErrorIndex.js";
import { generateProdErrorInfo } from "../utils/errors/errorInfo.js";

//Creación de router para los productos mock
const mockRouter = Router();

//Router para generación de Mock products en DB
mockRouter.get("/", (req, res) => {
  try {
    let product;
    for (let i = 0; i < 10; i++) {
      product = generateProducts();
      productController.add(product);
    }
    res.json({ message: "Mock products created" });
  } catch (error) {
    CustomErrors.createError(
      "Product creation error",
      generateProdErrorInfo(product),
      "Campos incompletos",
      ErrorIndex.INCOMPLETE_DATA
    );
  }
});

export default mockRouter;
