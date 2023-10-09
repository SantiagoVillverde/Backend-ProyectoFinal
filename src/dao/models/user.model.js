//Importaciones
import mongoose from "mongoose";

//Creación del schema de usuarios
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: String,
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  password: String,
  age: Number,
  img: {
    type: String,
    default: "noImg.jpeg"
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    enum: ["User", "Premium", "Admin"],
    default: "User",
  },
  documents: {
    type: [
      {
        name: String,
        reference: String,
      },
    ],
    default: [],
  },
  last_connection: Date,
});

//Uso de pre para popular el carrito de cada usuario
userSchema.pre("find", function () {
  this.populate(/*"carts.cart"*/"cart");
});

const userModel = mongoose.model("users", userSchema);
export default userModel;
