//Importaciones
import { productService } from "../repositories/repoIndex.js";

//Creación del controlador de productos
class ProductController {
  constructor() {
    this.service = productService;
  }

  //Obtener productos
  async get(limit, page, category, status, sort) {
    return await this.service.get(limit, page, category, status, sort);
  }

  //Obtener por ID
  async getById(pid) {
    return await this.service.getById(pid);
  }

  //Agregar un producto
  async add(product) {
    return await this.service.add(product);
  }

  //Actualizar un producto por su ID
  async update(pid, product) {
    return await this.service.update(pid, product);
  }

  //Borrar un producto por su ID
  async delete(pid) {
    return await this.service.delete(pid);
  }
}

const productController = new ProductController();
export default productController;
