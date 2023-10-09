//Importaciones
import { ticketService } from "../repositories/repoIndex.js";

//Creación del controlador de tickets
class TicketController {
  constructor() {
    this.service = ticketService;
  }

  //Obtener todos los tickets
  async get() {
    return await this.service.get();
  }

  //Obtener ticket por código
  async getByCode(code) {
    return await this.service.getByCode(code);
  }

  //Obtener por ID
  async getById(id) {
    return await this.service.getById(id);
  }

  //Generar un nuevo ticket
  async add(ticketData) {
    return await this.service.add(ticketData);
  }
}

const ticketController = new TicketController();
export default ticketController;
