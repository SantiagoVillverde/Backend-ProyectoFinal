//Creación del repositorio de productos
export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  //Obtener todos los productos con los filtros aplicados
  async get(limit, page, category, status, sort) {
    return await this.dao.get(limit, page, category, status, sort);
  }

  //Obtener por ID
  async getById(id) {
    return await this.dao.getById(id);
  }

  //Agregar un producto
  async add(product) {
    return await this.dao.add(product);
  }

  //Actualizar un producto por su ID
  async update(pid, product) {
    return await this.dao.update(pid, product);
  }

  //Eliminar un producto por su ID
  async delete(pid) {
    return await this.dao.delete(pid);
  }
}
