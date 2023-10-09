//Importaciones
import { productModel } from "../models/product.model.js";

//Creación del DAO de productos
export default class ProductMongoDAO {
  constructor() {
    this.collection = productModel;
  }

  //Obtener los productos, permitiendo aplicar los filtros para mostrarlos en el frontend
  async get(
    limit = 5,
    page = 1,
    category = false,
    status = false,
    sort = false
  ) {
    let filter = {};
    let labels = {
      docs: "payload",
      totalDocs: false,
    };
    let options = { lean: true, page, limit, sort, customLabels: labels };

    //Filtros de categoría y status
    if (category) {
      filter = { ...filter, category };
    }
    if (status) {
      filter = { ...filter, status };
    }

    //Ordenamiento por precio (ascendente o descendente)
    if (sort === "asc") {
      options.sort = { price: 1 };
    }
    if (sort === "desc") {
      options.sort = { price: -1 };
    }

    return await this.collection.paginate(filter, options);
  }

  //Obtener por ID
  async getById(pid) {
    return await this.collection.findById(pid).lean();
  }

  //Crear un nuevo producto
  async add(product) {
    return await this.collection.create(product);
  }

  //Actualizar un producto por su ID
  async update(pid, product) {
    return await this.collection.findByIdAndUpdate(
      pid,
      { $set: product },
      { new: true }
    );
  }

  //Eliminar un producto por su ID
  async delete(pid) {
    return await this.collection.findByIdAndDelete(pid);
  }
}
