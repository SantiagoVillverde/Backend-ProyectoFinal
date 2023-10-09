//Importaciones
import multer from "multer";
import * as path from "path";

//Creación de generador de middlewares de multer, con variaciones en la ruta y la extensión de los archivos a cargar
export const multerGenerator = (destination, extension) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd() + destination));
    },
    filename: (req, file, cb) => {
      cb(null, req.user.last_name + "_" + file.originalname + extension);
    },
  });

  return multer({storage})
}
