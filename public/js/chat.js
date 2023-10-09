//Inicialización de socket
const socket = io();

//Definición de variables y obtención de datos desde view
let user;
let chatBox = document.getElementById("chatBox");
let sendBtn = document.getElementById("sendBtn");
let userIdentified = false;

//Alerta con input para selección de nombre de usuario
Swal.fire({
  title: "Identificación",
  input: "text",
  text: "Escribe el nombre de usuario a utilizar en el chat",
  inputValidator: (value) => {
    return !value && "Necesitas escribir un nombre de usuario para continuar!";
  },
  allowOutsideClick: false,
}).then((result) => {
  //Se envía un emit de socket con el nombre de usuario elegido
  user = result.value;
  socket.emit("sayhello", user);
  userIdentified = true;
});

//Métodos para enviar mensajes, con teclado y mouse
chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});
sendBtn.addEventListener("click", (evt) => {
  if (chatBox.value.trim().length > 0) {
    socket.emit("message", { user: user, message: chatBox.value });
    chatBox.value = "";
  }
});

//Recepción de socket para mostrar mensajes
socket.on("messageLogs", (data) => {
  let log = document.getElementById("messageLogs");
  let messages = "";
  //Se itera por el array de mensajes para mostrarlos, definiendo el usuario que lo envió
  data.forEach((message) => {
    messages =
      messages +
      `<strong>${message.user}</strong> dice: ${message.message}</br>`;
  });
  log.innerHTML = messages;
});

//Alerta de socket para nueva conexión de otro usuario
socket.on("alert", (data) => {
  Swal.fire({
    text: `Nuevo usuario conectado: ${data}`,
    toast: true,
    position: "top-right",
  });
});