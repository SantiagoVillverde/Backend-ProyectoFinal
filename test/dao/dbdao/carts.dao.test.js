import chai from "chai";
import CartMongoDAO from "../../../src/dao/dbdao/cart.dao.js";
import mongoose from "mongoose";
import { appConfig } from "../../../src/config/env.config.js";

const expect = chai.expect;
const cartMongoDao = new CartMongoDAO();

mongoose.connect(appConfig.mongoUrl, { dbName: appConfig.mongoDbName });

describe("Test Unitario - DAO de Cart (MongoDB)", () => {
  let mockCartId;

  after(async () => {
    await cartMongoDao.delete(mockCartId);
  });

  it("El método GET obtiene los carritos actuales en forma de array", async () => {
    const result = await cartMongoDao.get();
    expect(result).to.be.an("array");
  }).timeout(5000);

  it("El método POST genera un nuevo carrito", async () => {
    const newCart = await cartMongoDao.add();
    expect(newCart._id).to.be.ok;
    mockCartId = newCart._id;
  }).timeout(5000);

  it("El método GET por ID trae el carrito según su ID", async () => {
    const result = await cartMongoDao.getById(mockCartId);
    expect(result).to.be.an("object");
  }).timeout(5000);

  it("El método PUT actualiza el carrito correctamente", async () => {
    const oldCart = cartMongoDao.getById(mockCartId);
    const updatedCart = {
      products: [{ product: "Test Product", quantity: 100 }],
    };
    const newCart = await cartMongoDao.update(mockCartId, updatedCart);
    expect(newCart.products).to.not.be.equal(oldCart.products);
  });

  it("El método para agregar productos al carrito funciona correctamente", async() =>{
    
  })
});
