//Importaciones
import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userController from "../controllers/user.controller.js";
import cartController from "../controllers/cart.controller.js";
import { encryptPassword, comparePassword } from "../utils/encrypt.util.js";
import { appConfig } from "./env.config.js";
import jwt from "passport-jwt";

//ESTRATEGIA LOCAL CON PASSPORT
const LocalStrategy = local.Strategy;

//ESTRATEGIA DE JWT CON PASSPORT
const JWTStrategy = jwt.Strategy;
const JWTExtract = jwt.ExtractJwt;

const initializePassport = () => {
  //ESTRATEGIA PARA REGISTER
  passport.use(
    "register",
    new LocalStrategy(
      //Se indica que el username será el email
      { passReqToCallback: true, usernameField: "email", session:false },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age, img } = req.body;
        try {
          //Se obtiene el usuario por email. Si es igual a las credenciales del admin, se rechaza el registro
          let user = await userController.getByEmail(username);
          if (user || username === appConfig.adminName) {
            req.logger.warning("El usuario ya existe");
            return done(null, false);
          }
          //Se encripta la contraseña y se genera el nuevo usuario
          const encryptedPass = await encryptPassword(password);
          const newUser = await userController.add({
            first_name,
            last_name,
            email,
            age,
            password: encryptedPass,
            img,
          });
          //Se genera un nuevo carrito y se asigna al nuevo usuario, salvando los cambios
          const userCart = await cartController.add();
          newUser.cart = userCart._id;
          await newUser.save();
          req.logger.info("Registro de usuario exitoso!")
          return done(null, newUser);
        } catch (err) {
          req.logger.fatal(`Error al registrar el usuario: ${err}`)
          return done(`Error al registrar el usuario: ${err}`, false);
        }
      }
    )
  );
  //ESTRATEGIA PARA LOGIN
  passport.use(
    "login",
    new LocalStrategy(
      //Se indica que el username será el email
      { passReqToCallback: true, usernameField: "email", session: false },
      async (req, username, password, done) => {
        try {
          //Si se dan las credenciales de admin, se genera un nuevo usuario con el rol de Admin
          if (
            username === appConfig.adminName &&
            password === appConfig.adminPassword
          ) {
            const adminUser = {
              first_name: "Coder",
              last_name: "House",
              email: username,
              role: "Admin",
              cart: [],
            };
            return done(null, adminUser);
          } else {
            //Se busca el usuario en la base de datos por email
            const user = await userController.getByEmail(username);
            if (!user) {
              //Si no existe, se solicita registro. 
              req.logger.error("El usuario no existe. Regístrese");
              return done(null, false);
            }
            if (!comparePassword(user, password)) {
              //Si la contraseña no es correcta con la almacenada, se solicita intentar nuevamente.
              req.logger.error(
                "La contraseña no es correcta. Intente nuevamente"
              );
              return done(null, false);
            }
            //Se modifica la última conexión del usuario en la BD
            user.last_connection = new Date();
            await userController.update(user._id, user);
            req.logger.info("Inicio de sesión exitoso!")
            return done(null, user);
          }
        } catch (err) {
          req.logger.fatal(`Error de servidor para el login: ${err}`);
          return done(`Error de servidor para el login: ${err}`)
        }
      }
    )
  );

  //EXTRACTOR DE COOKIES
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["jwToken"];
    }
    return token;
  };

    //ESTRATEGIA PARA VERIFICACIÓN CON JWT
  passport.use(
    "jwt",
    new JWTStrategy({
      jwtFromRequest: JWTExtract.fromExtractors([cookieExtractor]),
      secretOrKey: appConfig.jwtSecret,
      session: false,
    },
    async (payload, done) => {
      done(null, payload.user);
    })
  );

  //ESTRATEGIA PARA GITHUB
  passport.use(
    "github",
    new GitHubStrategy(
      //Se brindan los datos de Github para el linkeo
      {
        clientID: appConfig.githubClient,
        clientSecret: appConfig.githubSecret,
        callbackURL: "http://localhost:8080/api/users/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          //Se obtiene el usuario usando el email
          let user = await userController.getByEmail(profile._json.email);
          //En caso de no existir, se genera un nuevo usuario en la base de datos
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              password: "",
              age: undefined,
              img: profile._json.avatar_url,
            };
            user = await userController.add(newUser);
            done(null, user);
          } else {
            done(null, user);
          }
        } catch (err) {
          done(err, false);
        }
      }
    )
  );

  //ESTRATEGIAS DE SERIALIZACION Y DESERIALIZACION CON ID
  passport.serializeUser((user, done) => {
    if (user.role === "Admin") {
      done(null, user);
    } else {
      done(null, user._id);
    }
  });

  passport.deserializeUser(async (id, done) => {
    if (typeof id === "object" && id.role === "Admin") {
      done(null, id);
    } else {
      let user = await userController.getById(id);
      done(null, user);
    }
  });
};

export default initializePassport;
