//Importación de dotenv y el program definido con Commander
import dotenv from "dotenv";
import program from "./commander.config.js";

//Definición de constantes según los parámetros usados en consola
const port = program.opts().p;
const persistence = program.opts().pers;
const environment = program.opts().env;

//Uso de dotenv y exportación de todas las variables de entorno
dotenv.config({ path: `${process.cwd()}/.env/.env` });

export const appConfig = {
  port: port,
  persistence: persistence,
  environment: environment,
  mongoUrl: process.env.MONGO_URL,
  mongoDbName: process.env.MONGO_DBNAME,
  sessionSecret: process.env.SESS_SECRET,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  githubClient: process.env.GITHUB_CLIENT,
  githubSecret: process.env.GITHUB_SECRET,
  gmailUser: process.env.GMAIL_USER,
  gmailAppPass: process.env.GMAIL_APP_PASS,
  cookieSecret: process.env.COOKIE_SECRET,
  jwtSecret: process.env.JWT_SECRET
};
