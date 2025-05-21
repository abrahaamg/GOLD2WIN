let reporteSeleccionado = -1;

function vaciarModal() {
  document.getElementById("banDays").value = 0;
  document.getElementById("banHours").value = 0;
  document.getElementById("banMinutes").value = 0;
}

document.getElementById("banForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Evita el envío normal del formulario

  // Obtener los valores del formulario
  const days = parseInt(document.getElementById("banDays").value, 10) || 0;
  const hours = parseInt(document.getElementById("banHours").value, 10) || 0;
  const minutes = parseInt(document.getElementById("banMinutes").value, 10) || 0;

  const data = {
    dias: days,
    horas: hours,
    minutos: minutes
  };

  go(config.rootUrl + "/admin/reportes/"+reporteSeleccionado+"/determinar","POST",data).then(function(response) {
    location.reload();
  }).catch(function(error) {
    console.error("Error en la resolucion:", error);
  });
});

function abrirModal(id) {
  const modalElement = document.getElementById('banModal');
  const modal = new bootstrap.Modal(modalElement);
  reporteSeleccionado = id;
  vaciarModal();
  modal.show();
}