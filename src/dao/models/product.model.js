//Importaciones
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

//Creación del schema de productos
const productSchema = mongoose.Schema({
    title: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required:true
    },
    code: {
        type: String,
        required:true,
        unique: true
    },
    price: {
        type: Number,
        required:true
    },
    status: {
        type: Boolean,
        required:true,
        default:true,
    },
    stock: {
        type: Number,
        required:true
    },
    category: {
        type: String,
        required:true
    },
    owner: {
        type: String,
        required: true,
        default: "Admin"
    },
    thumbnail: String
})

//Uso de paginación para luego aplicarlo en el frontend
productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model("products", productSchema);
