//Importaciones
import MessageMongoDAO from "../dao/dbdao/message.dao.js";

//Creación del controlador de mensajes
class MessageController {
    constructor(){
        this.dao = new MessageMongoDAO();
    }

    //Obtener mensajes
    async get(){
        return await this.dao.get();
    }

    //Postear mensaje
    async add(message){
        return await this.dao.add(message);
    }

    //Borrar mensajes
    async delete(mid){
        return await this.dao.delete(mid)
    }
}

const messageController = new MessageController();
export default messageController;