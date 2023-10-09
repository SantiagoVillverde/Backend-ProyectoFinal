//Creación del DTO de carritos
export default class CartDTO {
  constructor(cart) {
    this.products = cart.products;
  }
}
