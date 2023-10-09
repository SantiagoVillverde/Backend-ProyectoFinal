//Importaciones
import { messageModel } from "../models/message.model.js"

//Creación del DAO de mensajes
export default class MessageMongoDAO {
    constructor(){
        this.model = messageModel;
    }

    //Obtener todos los mensajes
    async get(){
        return await messageModel.find().lean();
    }

    //Postear un nuevo mensaje
    async add(message){
        return await messageModel.create(message);
    }

    //Eliminar un mensaje por su ID
    async delete(mid){
        return await messageModel.findByIdAndDelete(mid)
    }
}

