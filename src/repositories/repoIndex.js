//Importaciones de DAO y repositorios
import UserMongoDAO from "../dao/dbdao/user.dao.js";
import UserRepository from "./users.repository.js";
import TicketMongoDAO from "../dao/dbdao/ticket.dao.js";
import TicketRepository from "./tickets.repository.js";
import CartMongoDAO from "../dao/dbdao/cart.dao.js";
import CartRepository from "./carts.repository.js";
import ProductMongoDAO from "../dao/dbdao/product.dao.js";
import ProductRepository from "./product.repository.js";

//Exportación de servicios inicializando los repositorios con los DAO
export const userService = new UserRepository(new UserMongoDAO());
export const ticketService = new TicketRepository(new TicketMongoDAO());
export const cartService = new CartRepository(new CartMongoDAO());
export const productService = new ProductRepository(new ProductMongoDAO());
