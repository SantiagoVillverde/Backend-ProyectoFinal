//Importaciones
import { Router } from "express";
import productController from "../controllers/product.controller.js";
import messageController from "../controllers/message.controller.js";
import cartController from "../controllers/cart.controller.js";
import userController from "../controllers/user.controller.js";
import {
  isAuth,
  isGuest,
  authMiddleware,
} from "../middlewares/auth.middleware.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

//Creación de router de vistas
const viewsRouter = Router();

viewsRouter.get("/", verifyToken, isGuest, (req, res) => {
  res.render("login", {
    title: "Iniciar sesión",
  });
});

//Vista de productos (usando filtros y paginación)
viewsRouter.get("/products", verifyToken, isAuth, async (req, res) => {
  //Obtención del usuario
  const user = await userController.getById(req.user._id);
  req.user = user;
  delete user.password;
  //Configuración de filtros
  const { limit, page, category, availability, sort } = req.query;
  const prodList = await productController.get(
    limit,
    page,
    category,
    availability,
    sort
  );
  prodList.status = "success";
  prodList.category = category;
  prodList.availability = availability;
  prodList.sort = sort;

  //Configuración para paginación
  prodList.prevLink = prodList.hasPrevPage
    ? `products?page=${prodList.prevPage}`
    : "";
  prodList.nextLink = prodList.hasNextPage
    ? `products?page=${prodList.nextPage}`
    : "";

  //Validación del rol para mostrar panel de Admin/Premium en la vista
  const isUser = user.role === "User";

  res.render("products", {
    title: "Listado de Productos",
    prodList,
    user,
    isUser,
  });
});

//Vista de productos en tiempo real con socket
viewsRouter.get("/realtimeproducts", verifyToken, isAuth, async (req, res) => {
  const prodList = await productController.get();
  res.render("realTimeProducts", { prodList });
});

//Vista del chat
viewsRouter.get(
  "/chat",
  verifyToken,
  isAuth,
  authMiddleware(["User"]),
  async (req, res) => {
    const renderMessages = await messageController.get();
    const user = await userController.getById(req.user._id);
    res.render("chat", { title: "CoderChat", renderMessages, user });
  }
);

//Vista de registro
viewsRouter.get("/register", isGuest, (req, res) => {
  res.render("register", {
    title: "Registrar nuevo usuario",
  });
});

//Vista de error de registro
viewsRouter.get("/registererror", (req, res) => {
  res.render("registererror", {
    title: "Error al registrarse",
  });
});

//Vista de error de inicio de sesión
viewsRouter.get("/loginerror", (req, res) => {
  res.render("loginerror", {
    title: "Error al iniciar sesión",
  });
});

//Vista de carrito actual y datos del usuario
viewsRouter.get(
  "/current",
  verifyToken,
  isAuth,
  authMiddleware(["User", "Premium"]),
  async (req, res) => {
    const user = req.user;
    const cart = await cartController.getById(user.cart);
    const cartEmpty = cart.products.length < 1 ? true : false;
    const userToShow = await userController.getById(user._id);
    res.render("current", {
      title: "Carrito de Compras",
      userToShow,
      cart,
      cartEmpty,
    });
  }
);

//Vista de finalización de compra
viewsRouter.get("/purchase", verifyToken, isAuth, async (req, res) => {
  const user = req.user;
  const userToShow = await userController.getById(user._id);
  res.render("purchase", {
    title: "Compra Finalizada",
    userToShow,
  });
});

//Vista para inicio de recuperación de contraseña
viewsRouter.get("/passrecover", isGuest, async (req, res) => {
  res.render("passrecoverstart", {
    title: "Recuperar contraseña",
  });
});

//Vista para finalización de recuperación de contraseña
viewsRouter.get("/newpass", isGuest, async (req, res) => {
  res.render("passrecoverend", {
    title: "Restablecer contraseña",
  });
});

//Vista de lista de usuarios (acceso para Admin)
viewsRouter.get(
  "/userlist",  verifyToken, isAuth,
  authMiddleware(["User", "Premium"]),
  async (req, res) => {
    try {
      const userList = await userController.get();
      const user = await userController.getById(req.user._id);
      res.render("userlist", {
        title: "Listado de usuarios - Acceso de Administrador",
        userList,
        user
      });
    } catch (err) {
      req.logger.fatal(`Error interno al acceder al panel de usuarios: ${err}`)
      res.status(500).send(`Error interno al acceder al panel de usuarios: ${err}`)
    }
  }
);

export default viewsRouter;
