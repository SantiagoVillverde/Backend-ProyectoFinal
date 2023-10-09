//Importaciones
import CartDTO from "../dto/cart.dto.js";

//Creación del repositorio de carts
export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  //Obtener los carritos
  async get() {
    return await this.dao.get();
  }

  //Obtener por ID (usando DTO)
  async getById(id) {
    const cart = await this.dao.getById(id);
    const cartDTO = new CartDTO(cart);
    return cartDTO;
  }

  //crear nuevo carrito
  async add(cart) {
    return await this.dao.add(cart);
  }

  //Actualizar un carrito por su ID
  async update(cid, cart) {
    return await this.dao.update(cid, cart);
  }

  //Eliminar un carrito por su ID
  async delete(cid) {
    return await this.dao.delete(cid)
  }

  //Agregar producto al carrito por su ID
  async addProdtoCart(cid, pid) {
    return await this.dao.addProdtoCart(cid, pid);
  }

  //Eliminar producto del carrito por su ID
  async deleteProdfromCart(cid, pid) {
    return await this.dao.deleteProdfromCart(cid, pid);
  }

  //Actualizar un producto del carrito por su ID
  async updateProdfromCart(cid, pid, quantity) {
    return await this.dao.updateProdfromCart(cid, pid, quantity);
  }

  //Vaciar el carrito
  async deleteAllProds(cid) {
    return await this.dao.deleteAllProds(cid);
  }
}
