//Creación del DTO de usuarios
export default class UserDTO {
  constructor(user) {
    this.id = user._id.toString();
    this.name = user.first_name + " " + user.last_name;
    this.email = user.email;
    this.role = user.role;
    this.last_connection = user.last_connection;
  }
}
