//Importaciones
import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";

//Creación del DAO de carritos
export default class CartMongoDAO {
  constructor() {
    this.collection = cartModel;
  }

  //Obtener todos los carritos
  async get() {
    return await this.collection.find().lean();
  }

  //Obtener por ID (usando populate y lean para luego mostrar los productos)
  async getById(cid) {
    return await this.collection
      .findById(cid)
      .populate("products.product", "-__v")
      .lean();
  }

  //Crear un nuevo carrito
  async add(cart) {
    return await this.collection.create(cart);
  }

  //Actualizar un carrito por ID
  async update(cid, cart) {
    return await this.collection.findByIdAndUpdate(
      cid,
      { $set: cart },
      { new: true }
    );
  }

  //Eliminar un carrito por ID
  async delete(cid) {
    return await this.collection.findByIdAndDelete(cid);
  }

  //Agregar un producto al carrito por su ID
  async addProdtoCart(cid, pid) {
    try {
      //Se trae la lista de carritos y se busca el que corresponde según el id
      let selectedCart = await this.getById(cid);

      //Se trae la lista de productos y se busca el que corresponde según el id
      let selectedProduct = await productModel.findById(pid);

      //Se busca si el producto ya está en el carrito
      let existingProduct = selectedCart.products.find((prod) => {
        return prod.product._id.toString() === selectedProduct._id.toString();
      });

      //Si el producto existe, se aumenta su cantidad en 1. Caso contrario, se agrega al carrito.
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        selectedCart.products.push({
          product: selectedProduct._id,
          quantity: 1,
        });
      }

      //Se actualiza el carrito
      await this.update(cid, selectedCart);
    } catch (err) {
      console.log(`Error al agregar el producto al carrito por ID: ${err}`);
    }
  }

  //Eliminar productos del carrito
  async deleteProdfromCart(cid, pid) {
    try {
      //Se busca el carrito por su ID y se elimina el mismo mediante un $pull
      await this.collection.updateOne(
        { _id: cid },
        { $pull: { products: { product: pid } } }
      );
      return { success: true, message: "Producto eliminado del carrito" };
    } catch (err) {
      console.log(`Error al borrar el producto del carrito por ID: ${err}`);
    }
  }

  //Vaciar el carrito
  async deleteAllProds(cid) {
    try {
      await this.collection.updateOne({ _id: cid }, { $set: { products: [] } });
    } catch (err) {
      console.log(`Error al borrar los productos del carrito: ${err}`);
    }
  }

  //Actualizar un producto del carrito (cantidad del mismo) por su ID
  async updateProdfromCart(cid, pid, quantity) {
    try {
      await this.collection.updateOne(
        { _id: cid, "products.product": pid },
        { $set: { "products.$.quantity": quantity.quantity } }
      );
    } catch (err) {
      console.log(
        `Error actualizando la cantidad del producto del carrito: ${err}`
      );
    }
  }
}
