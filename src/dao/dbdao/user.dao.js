//Importaciones
import userModel from "../models/user.model.js";

//Creación del DAO de usuarios
export default class UserMongoDAO {
  constructor() {
    this.collection = userModel;
  }

  //Obtener todos los usuarios
  async get() {
    return await this.collection.find().lean();
  }

  //Obtener por E-Mail
  async getByEmail(email) {
    return await this.collection.findOne({ email: email });
  }

  //Obtener por ID
  async getById(id) {
    return await this.collection.findById(id).lean();
  }

  //Crear un nuevo usuario
  async add(userData) {
    return await this.collection.create(userData);
  }

  //Actualizar un usuario por ID
  async update(uid, user) {
    return await this.collection.findByIdAndUpdate(uid, user);
  }

  //Eliminar un usuario por ID
  async delete(uid) {
    return await this.collection.findByIdAndDelete(uid);
  }
}
