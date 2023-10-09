//Importaciones
import TicketDTO from "../dto/ticket.dto.js";

//Creación del repositorio de tickets
export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  //Obtener todos los tickets
  async get() {
    return await this.dao.get();
  }

  //Obtener por código (usando DTO)
  async getByCode(code) {
    const ticket = await this.dao.getByCode(code);
    const ticketDTO = new TicketDTO(ticket);
    return ticketDTO;
  }

  //Obtener por ID (usando DTO)
  async getById(id) {
    const ticket = await this.dao.getById(id);
    const ticketDTO = new TicketDTO(ticket);
    return ticketDTO;
  }

  //Generar un nuevo ticket
  async add(ticketData) {
    return await this.dao.add(ticketData);
  }
}
