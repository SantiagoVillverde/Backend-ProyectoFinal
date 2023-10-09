//Importaciones
import {
  cartService,
  productService,
  ticketService,
  userService,
} from "../repositories/repoIndex.js";
import nodemailer from "nodemailer";
import { appConfig } from "../config/env.config.js";

//Definición de constante transport para envío de mail con ticket
const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: appConfig.gmailUser,
    pass: appConfig.gmailAppPass,
  },
});

//Creación del controlador de compras
class PurchaseController {
  async endPurchase(cid, user) {
    try {
      //Obtengo el carrito y sus productos
      const cart = await cartService.getById(cid);
      const cartProducts = cart.products;

      //Genero un array para los productos finales
      let finalProducts = [];
      let finalPrice = 0;

      //Se recorre cada producto del cart
      for (const prod of cartProducts) {
        //Se obtiene id del producto y se busca en la lista general
        const cartProdId = prod.product;
        const productFromList = await productService.getById(cartProdId);

        //Si la cantidad es menor o igual al stock disponible, se restan del mismo
        if (prod.quantity <= productFromList.stock) {
          productFromList.stock -= prod.quantity;
          await productService.update(productFromList._id, productFromList);
          //Se carga el producto en el array final
          finalProducts.push(prod);
          //Se elimina del carrito
          await cartService.deleteProdfromCart(cid, prod.product);
          //Se suma el precio total
          const productPrice = productFromList.price;
          finalPrice += prod.quantity * productPrice;
        } else {
          //En caso de no haber stock suficiente, se loggea un error
          console.log(
            `${productFromList.title}: Stock insuficiente para la compra`
          );
        }
      }

      //Obtención del usuario actual
      const purchaseUser = await userService.getById(user._id);

      //GENERACIÓN DE TICKET DE COMPRA
      //Generación de código aleatorio
      function codeGenerator() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";

        for (let i = 0; i < 10; i++) {
          const randIndex = Math.floor(Math.random() * chars.length);
          code += chars.charAt(randIndex);
        }

        return code;
      }

      let ticketCode = codeGenerator();

      //Armado del ticket
      await ticketService.add({
        amount: finalPrice,
        purchaser: purchaseUser.email,
        code: ticketCode,
      });

      //GENERACIÓN DE MAIL PARA ENVÍO DE TICKET
      let mail = await transport.sendMail({
        from: `CoderCommerce ${appConfig.gmailUser}`,
        to: purchaseUser.email,
        subject: "Compra Exitosa!",
        html: `
              <div>
              <h1>Compra finalizada exitosamente!</h1>
              <p>Su compra ha sido realizada correctamente. Para poder seguir el estado de la misma, use el siguiente código:</p>
              <h3>${ticketCode}</h3>
              </div>
        `,
        attachments: [],
      });
    } catch (error) {
      console.error("Error durante la compra:", error);
    }
  }
}

const purchaseController = new PurchaseController();
export default purchaseController;
