//Importaciones
import mongoose from "mongoose";

//Creación del schema de mensajes
const messageSchema = mongoose.Schema({
    "user": String,
    "message": String
})

export const messageModel = mongoose.model("messages", messageSchema);
