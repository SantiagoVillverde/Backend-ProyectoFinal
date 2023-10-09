//Importaciones
import ticketModel from "../models/ticket.model.js";

//Creación del DAO de tickets
export default class TicketMongoDAO {
  constructor() {
    this.collection = ticketModel;
  }

  //Obtener todos los tickets
  async get() {
    return await this.collection.find();
  }

  //Obtener por código
  async getByCode(code) {
    return await this.collection.findOne({ code: code });
  }

  //Obtener por ID
  async getById(id) {
    return await this.collection.findById(id).lean();
  }

  //Generar un nuevo ticket
  async add(userData) {
    return await this.collection.create(userData);
  }

  //Eliminar un ticket
  async delete(id) {
    return await this.collection.findByIdAndDelete(id);
  }
}
