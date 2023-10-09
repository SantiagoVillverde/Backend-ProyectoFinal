//FUNCIÓN PARA ELIMINAR PRODUCTOS DE CARRITO
function deleteFromCart(pid) {
  //Se obtiene id de carrito y se define como url param
  const cid = document.getElementById("cartId").value;
  const url = `/api/carts/${cid}/product/${pid}`;

  //Método fetch con delete para eliminar producto
  fetch(url, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        location.reload();
      } else {
        console.log("Failed to remove product from cart");
      }
    })
    .catch((error) => {
      console.log("Error occurred while removing product from cart:", error);
    });
}

//FUNCIÓN PARA FINALIZAR COMPRAS 
function endPurchase (){
  //Se obtiene id de carrito y se define como url param
    const cid = document.getElementById("cartId").value;
    const url = `/api/carts/${cid}/purchase`;

    //Método fetch con post para enviar la compra
    fetch(url, {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          setTimeout(()=>{
            location.reload();
          }, 800)
        } else {
          console.log("Error al obtener response para finalizar compra");
        }
      })
      .catch((err) => {
        console.log("Error interno al finalizar compra:", err);
      });
  }