import { appConfig } from "../../config/env.config.js";

let UsersPersist, ProductsPersist, MessagesPersist, CartsPersist;
switch (appConfig.persistence) {
  
  case "mongo":
    const { default: UserMongoDAO } = await import("../dbdao/user.dao.js");
    UsersPersist = UserMongoDAO;
    const { default: ProductMongoDAO } = await import(
      "../dbdao/product.dao.js"
    );
    ProductsPersist = ProductMongoDAO;
    const { default: MessageMongoDAO } = await import(
      "../dbdao/message.dao.js"
    );
    MessagesPersist = MessageMongoDAO;
    const { default: CartMongoDAO } = await import("../dbdao/cart.dao.js");
    CartsPersist = CartMongoDAO;
    break;

  case "file":
    const { default: UserFileDAO } = await import("../fsdao/user.dao.js");
    UsersPersist = UserFileDAO;
    const { default: ProductFileDAO } = await import(
      "../fsdao/product.dao.js"
    );
    ProductsPersist = ProductFileDAO;
    const { default: MessageFileDAO } = await import(
      "../fsdao/message.dao.js"
    );
    MessagesPersist = MessageFileDAO;
    const { default: CartFileDAO } = await import("../fsdao/cart.dao.js");
    CartsPersist = CartFileDAO;
    break;
}

export {UsersPersist, ProductsPersist, MessagesPersist, CartsPersist};