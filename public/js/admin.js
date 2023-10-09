//FUNCIÓN PARA ELIMINAR USUARIOS
function deleteUser(uid) {
  //Método fetch con delete para eliminar usuario
  fetch(`/api/users/${uid}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.status === 200) {
        //Alerta de producto agregado
        Swal.fire({
          text: `Usuario eliminado!`,
          toast: true,
          icon: "success",
          position: "bottom-right",
        });
      } else {
        //Alerta de error al agregar producto
        Swal.fire({
          text: `No puede eliminarse el usuario: No se cumplió el tiempo de inactividad.`,
          icon: "error",
          toast: true,
          position: "bottom-right",
        });
      }
    })
    .catch((error) => {
      console.error("Error al eliminar usuario:", error);
    });
}
