function sendMail() {
  const email = document.getElementById("email").value;
  fetch(`/api/passrecov/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => {
      if (response.ok) {
        Swal.fire({
          text: `El mail de recupero de contraseña fue enviado a ${email}!`,
          toast: true,
          icon: "info",
          position: "bottom-right",
        });
      } else {
        console.log("Error al enviar mail para recupero de contraseña");
      }
    })
    .catch((error) => {
      console.log("Error al intentar enviar mail:", error);
    });
}

function recoverPass() {
  const email = document.getElementById("email").value;
  const newPass = document.getElementById("newPassword").value;
  const repeatNewPass = document.getElementById("repeatNewPassword").value;
  const token = window.location.search.split("=")[1]
  if (newPass === "" || repeatNewPass === "") {
    console.log("Campos incompletos")
    Swal.fire({
      text: `Campos incompletos`,
      toast: true,
      icon: "error",
      position: "bottom-right",
      showConfirmButton: false,
      timer: 4000,
    });
  }
  if (newPass !== repeatNewPass) {
    Swal.fire({
      text: `Las contraseñas no coinciden, intente nuevamente`,
      toast: true,
      icon: "error",
      position: "bottom-right",
      showConfirmButton: false,
      timer: 4000,
    });
  } else {
    fetch(`/api/passrecov/newpass?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, newPass, repeatNewPass }),
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire({
            text: `La contraseña se modificó correctamente!`,
            toast: true,
            icon: "success",
            position: "bottom-right",
          });
        } else {
          console.log("Error al enviar mail para recupero de contraseña");
        }
      })
      .catch((error) => {
        console.log("Error al intentar enviar mail:", error);
      });
  }
}
