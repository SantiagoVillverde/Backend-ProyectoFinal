import * as fs from "fs";

export default class CartsManager {
  //Declaración de variable y funciones para obtención automática del id por carrito ingresado
  #lastCartID = 0;

  //Obtención del último ID de la lista, obteniendo el máximo encontrado
  async #getLastId() {
    let cartList = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    let oldIds = await cartList.map((prod) => prod.id);
    if (oldIds.length > 0) {
      return (this.#lastCartID = Math.max(...oldIds));
    }
  }

  //Asignación del nuevo ID al carrito a agregar
  async #getNewId() {
    await this.#getLastId();
    this.#lastCartID++;
    return this.#lastCartID;
  }

  //Método constructor del array principal del CartsManager
  constructor(path) {
    this.path = path;
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
  }

  //Método para añadir un carrito al array
  async addCart(prodCart) {
    try {
      let cartList = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
      //Función para evitar ids duplicados
      await cartList.forEach((cart) => {
        if (cart.id === prodCart.id) {
          console.log("Error: El ID ya existe");
        }
      });
      prodCart.id = await this.#getNewId(); //Función para generar el id automáticamente
      cartList.push(prodCart); //Añadido del carrito al array
      await fs.promises.writeFile(this.path, JSON.stringify(cartList));
    } catch (err) {
      console.log(`Error al agregar el carrito: ${err}`);
    }
  }

  //Método para obtener todos los carritos actuales
  async getCarts() {
    try {
      let cartList = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
      return cartList;
    } catch (err) {
      console.log(`Error al obtener los carritos: ${err}`);
    }
  }

  //Método para obtener un carrito por su id
  async getCartById(id) {
    try {
      let cartList = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
      return cartList.find((cart) => {
        return cart.id === id;
      });
    } catch (err) {
      console.log(`Error al obtener el carrito por ID: ${err}`);
    }
  }

  //Método para añadir un producto a un carrito usando ids
  async addProdtoCart(cid, pid) {
    try {
      //Se trae la lista de carritos y se busca el que corresponde según el id
      let cartList = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
      let selectedCart = cartList.find((cart) => {
        return cart.id == cid;
      });

      //Se trae la lista de productos y se busca el que corresponde según el id
      let prodList = JSON.parse(
        await fs.promises.readFile("./products.json", "utf-8")
      );
      let selectedProduct = prodList.find((prod) => {
        return prod.id == pid;
      });

      //Definición de variables para producto ya existente
      let prodFound = false;
      let oldProd;

      //Uso de método forEach para verificar la existencia de un producto, cambiando la variable a true si se encontró y seleccionando ese producto para actualizarlo luego.
      selectedCart.products.forEach((prod) => {
        if (prod.id === selectedProduct.id) {
          prodFound = true;
          oldProd = prod;
        }
      });

      //Uso de condicional para determinar si existe o no el producto en el carrito seleccionado
      if (prodFound) {
        oldProd.quantity++; //Si el producto existe, se aumenta su cantidad en 1
      } else {
        selectedCart.products.push({ id: selectedProduct.id, quantity: 1 }); //Si el producto no existe, se ingresa en el carrito con cantidad de 1.
      }
      await fs.promises.writeFile(this.path, JSON.stringify(cartList));
    } catch (err) {
      console.log(`Error al agregar el producto al carrito por ID: ${err}`);
    }
  }

  //Método para eliminar un carrito usando id
  async deleteCart(id) {
    try {
      let cartList = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
      cartList = await cartList.filter((cart) => {
        return cart.id !== id;
      });
      await fs.promises.writeFile(this.path, JSON.stringify(cartList));
    } catch (err) {
      console.log(`Error al borrar el producto por ID: ${err}`);
    }
  }
}
