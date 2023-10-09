//Importaciones
import { cartService } from "../repositories/repoIndex.js";

//Creación del controlador de Carrito
class CartController {
  constructor() {
    this.service = cartService;
  }

  //Obtener carritos
  async get() {
    return await this.service.get();
  }

  //Obtener por ID
  async getById(cid) {
    return await this.service.getById(cid);
  }

  //Crear carrito
  async add(cart) {
    return await this.service.add(cart);
  }

  //Actualizar carrito
  async update(cid, cart) {
    return await this.service.update(cid, cart);
  }

  //Eliminar carrito por su ID
  async delete(cid){
    return await this.service.delete(cid)
  }

  //Agregar producto a carrito por id
  async addProdtoCart(cid, pid) {
    return await this.service.addProdtoCart(cid, pid);
  }

  //Eliminar producto de carrito por id
  async deleteProdfromCart(cid, pid) {
    return await this.service.deleteProdfromCart(cid, pid);
  }

  //Actualizar producto del carrito por id
  async updateProdfromCart(cid, pid, quantity) {
    return await this.service.updateProdfromCart(cid, pid, quantity);
  }

  //Vaciar carrito
  async deleteAllProds(cid) {
    return await this.service.deleteAllProds(cid);
  }
}

const cartController = new CartController();
export default cartController;
