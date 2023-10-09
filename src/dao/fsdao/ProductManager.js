import * as fs from "fs";

export default class ProductManager {
  //Declaración de variable y funciones para obtención automática del id por producto ingresado
  #lastProdID = 0;

  //Obtención del último ID de la lista, obteniendo el máximo encontrado
  async #getLastId() {
    let productList = JSON.parse(
      await fs.promises.readFile(this.path, "utf-8")
    );
    let oldIds = await productList.map((prod) => prod.id);
    if (oldIds.length > 0) {
      return (this.#lastProdID = Math.max(...oldIds));
    }
  }

  //Asignación del nuevo ID al producto a agregar
  async #getNewId() {
    await this.#getLastId();
    this.#lastProdID++;
    return this.#lastProdID;
  }

  //Método constructor del array principal del ProductManager
  constructor(path) {
    this.path = path;
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
  }

  //Función asíncrona para agregar el producto y guardarlo en el archivo
  async addProduct(product) {
    try {
      if (
        !product.title ||
        !product.description ||
        !product.code ||
        !product.price ||
        !product.status ||
        !product.stock ||
        !product.category
      ) {
        console.log("Error: Todos los campos deben ser completados");
      } else {
        let foundCode = false;
        let productList = JSON.parse(
          await fs.promises.readFile(this.path, "utf-8")
        );
        productList.forEach((prod) => {
          if (prod.code === product.code) {
            foundCode = true;
          }
        });
        if (!foundCode) {
          product.id = await this.#getNewId();
          productList.push(product);
          await fs.promises.writeFile(this.path, JSON.stringify(productList));
          return;
        } else {
          console.log("Error: El código de producto ya existe");
        }
      }
    } catch (err) {
      console.log(`Error al agregar el producto: ${err}`);
    }
  }

  //Función asíncrona para obtener los productos desde el archivo
  async getProducts() {
    try {
      let productList = JSON.parse(
        await fs.promises.readFile(this.path, "utf-8")
      );
      return productList;
    } catch (err) {
      console.log(`Error al obtener los productos: ${err}`);
    }
  }

  //Función asíncrona para obtener producto por ID desde el archivo
  async getProductById(id) {
    try {
      let productList = JSON.parse(
        await fs.promises.readFile(this.path, "utf-8")
      );

      return productList.find((prod) => {
        return prod.id === id;
      });
    } catch (err) {
      console.log(`Error al obtener el producto por ID: ${err}`);
    }
  }

  //Función asíncrona para actualizar un producto por ID desde el archivo
  async updateProduct(id, changes) {
    try {
      let productList = JSON.parse(
        await fs.promises.readFile(this.path, "utf-8")
      );
      let prodIndex = await productList.findIndex((prod) => prod.id === id);
      if (prodIndex !== -1) {
        productList[prodIndex] = { ...productList[prodIndex], ...changes };
        await fs.promises.writeFile(this.path, JSON.stringify(productList));
      }
    } catch (err) {
      console.log(`Error al actualizar el producto por ID: ${err}`);
    }
  }

  //Función asíncrona para borrar un producto por ID desde el archivo
  async deleteProduct(id) {
    try {
      let productList = JSON.parse(
        await fs.promises.readFile(this.path, "utf-8")
      );
      productList = await productList.filter((prod) => {
        return prod.id !== id;
      });
      await fs.promises.writeFile(this.path, JSON.stringify(productList));
    } catch (err) {
      console.log(`Error al borrar el producto por ID: ${err}`);
    }
  }
}

//Code by Juan Manuel Eiroa :)
