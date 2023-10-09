const socket = io();

socket.on("newProd", (prod) => {
  const tableBody = document.getElementById("prodTableBody");

  const newRow = document.createElement("tr");

  newRow.innerHTML = `
      <td>${prod._id}</td>
      <td>${prod.title}</td>
      <td>${prod.description}</td>
      <td>${prod.code}</td>
      <td>${prod.price}</td>
      <td>${prod.stock}</td>
      <td>${prod.category}</td>
    `;

  tableBody.appendChild(newRow);
});

socket.on("deletedProd", (prodId) => {
  const tableBody = document.getElementById("prodTableBody");
  const rowToDelete = document.getElementById(`productRow_${prodId}`);
  if (rowToDelete) {
    tableBody.removeChild(rowToDelete);
  }
});
