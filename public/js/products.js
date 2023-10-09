//FUNCIÓN PARA AGREGAR PRODUCTOS AL CARRITO
function addToCart(pid) {
  //Se obtiene id de carrito y se define como url param
  const cid = document.getElementById("cartId").value;
  //Método fetch con post para agregar productos
  fetch(`/api/carts/${cid}/product/${pid}`, {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        //Alerta de producto agregado
        Swal.fire({
          text: `Producto agregado al carrito!`,
          toast: true,
          icon: "success",
          position: "bottom-right",
        });
      } else {
        //Alerta de error al agregar producto
        Swal.fire({
          text: `Error al agregar el producto al carrito.`,
          icon: "error",
          toast: true,
          position: "bottom-right",
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//FUNCIÓN PARA ELIMINAR PRODUCTOS
function deleteProd(){
  //Se obtiene id de producto y se define como url param
  const pid = document.getElementById("prodId").value;
//Método fetch con post para eliminar productos
  fetch(`/api/products/${pid}`, {method: "DELETE"})
  .then((response) => {
    if (response.ok) {
      //Alerta de producto eliminado
      Swal.fire({
        text: `Producto eliminado`,
        toast: true,
        icon: "success",
        position: "bottom-right",
      });
    } else {
      //Alerta de error al eliminar producto
      Swal.fire({
        text: `Error al eliminar el producto`,
        icon: "error",
        toast: true,
        position: "bottom-right",
      });
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
}


//FUNCIÓN PARA ACTUALIZAR PRODUCTOS
function updateProd(){
  //Se obtiene id de producto y se define como url param
  const pid = document.getElementById("updateProdId").value;

  //Se define el producto con lo elegido en los input
  const updatedProd = {
    title: document.getElementById("updateTitle").value,
    description: document.getElementById("updateDescription").value,
    code: document.getElementById("updateCode").value,
    price: document.getElementById("updatePrice").value,
    stock: document.getElementById("updateStock").value,
    category: document.getElementById("updateCategory").value,
    thumbnail: document.getElementById("updateThumbnail").value,
  }

  //Busca los campos vacíos y los elimina para evitar que afecten al update
  const filteredUpdatedProd = {};
  for (const [key, value] of Object.entries(updatedProd)) {
    if (value !== "") {
      filteredUpdatedProd[key] = value;
    }
  }


//Método fetch con put para actualizar productos
fetch(`/api/products/${pid}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(filteredUpdatedProd),
})
  .then((response) => {
    if (response.ok) {
      //Alerta de producto actualizado
      Swal.fire({
        text: `Producto actualizado`,
        toast: true,
        icon: "success",
        position: "bottom-right",
      });
    } else {
      //Alerta de error al actualizar producto
      Swal.fire({
        text: `Error al actualizar el producto`,
        icon: "error",
        toast: true,
        position: "bottom-right",
      });
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
}
