//Importaciones
import UserDTO from "../dto/user.dto.js";

//Creación del repositorio de usuarios
export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  //Obtener todos los usuarios
  async get() {
    const users = await this.dao.get();
    const usersDTO = users.map((user) => new UserDTO(user));
    console.log(usersDTO)
    return usersDTO;
  }

  //Obtener por E-mail
  async getByEmail(email) {
    return await this.dao.getByEmail(email);
  }

  //Obtener por ID
  async getById(id) {
    return await this.dao.getById(id);
  }

  //Crear un nuevo usuario (realizando validaciones de campos)
  async add(userData) {
    if (
      !userData.first_name ||
      !userData.last_name ||
      !userData.email ||
      !userData.password
    ) {
      throw new Error("Campos incompletos");
    }
    return await this.dao.add(userData);
  }

  //Actualizar un usuario por su ID
  async update(uid, user) {
    return await this.dao.update(uid, user);
  }

  //Eliminar un usuario por su ID
  async delete(uid) {
    return await this.dao.delete(uid)
  }
}
