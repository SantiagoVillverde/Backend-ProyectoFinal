import chai from "chai";
import ProductMongoDAO from "../../../src/dao/dbdao/product.dao.js";
import mongoose from "mongoose";
import { appConfig } from "../../../src/config/env.config.js";

const expect = chai.expect;
const productMongoDao = new ProductMongoDAO();

mongoose.connect(appConfig.mongoUrl, { dbName: appConfig.mongoDbName });

describe("Test Unitario - DAO de Product (MongoDB)", () => {
  let mockProductId;

  after(async () => {
    await productMongoDao.delete(mockProductId);
  });

  it("El método GET obtiene los productos actuales en forma de array", async () => {
    const result = await productMongoDao.get();
    expect(result.payload).to.be.an("array");
  }).timeout(5000);

  it("El método POST genera un nuevo producto", async () => {
    const newProduct = {
        title: "Test Prod",
        description: "Este es un producto para testing",
        code: "TEST00",
        price: 10000,
        stock: 100,
        category: "Test"
    }
    const result = await productMongoDao.add(newProduct);
    expect(result._id).to.be.ok;
    mockProductId = result._id;
  }).timeout(5000);

  it ("El método POST valida los campos requeridos (título) para poder crear un producto", async()=>{
    const newProduct = {
        description: "Este es un producto para testing",
        code: "TEST00",
        price: 10000,
        stock: 100,
        category: "Test"
    }
    try {
        const result = await productMongoDao.add(newProduct);
      } catch (error) {
        expect(error.errors.title).to.exist;
        return;
      }
  })

  it("El método GET por ID trae el producto según su ID", async () => {
    const result = await productMongoDao.getById(mockProductId);
    expect(result).to.be.an("object");
  }).timeout(5000);

  it("El método PUT actualiza el producto correctamente", async () => {
    const oldProduct = productMongoDao.getById(mockProductId);
    const updatedProduct = {
      title: "Test Product UPDATE",
    };
    const newProduct = await productMongoDao.update(mockProductId, updatedProduct);
    expect(newProduct.title).to.not.be.equal(oldProduct.title);
  });
});
