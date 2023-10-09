//Importación de bcrypt
import bcrypt from "bcrypt";

//Función para encriptación de contraseñas
export const encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

//Función para comparación de contraseñas
export const comparePassword = (user, pass) => {
  return bcrypt.compareSync(pass, user.password);
};
