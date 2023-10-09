//Importaciones
import mongoose from "mongoose";

//Creación del schema de carritos
const cartSchema = mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: Number,
      },
    ],
    default: [],
  },
});

//Uso de pre para popular los productos del carrito
cartSchema.pre("find", function(){
  this.populate("products.product")
})

export const cartModel = mongoose.model("carts", cartSchema);
