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

function abrirModalVerMasReporte(id) {
    go(config.rootUrl + '/admin/reportes/cargarDatosReporte/' + id, 'GET')
        .then(data => {
            document.getElementById("reporteId").textContent = data.id;
            document.getElementById("reporteReportador").textContent = data.reportador;
            document.getElementById("reporteUsuarioReportado").textContent = data.usuarioReportado;
            document.getElementById("reporteMotivo").textContent = data.motivo;
            document.getElementById("reporteMensaje").textContent = data.mensaje;
            document.getElementById("reporteFechaEnvio").textContent = data.fechaEnvio;
            document.getElementById("reporteResuelto").textContent = data.resuelto ? "Sí" : "No";
            document.getElementById("reporteFechaResolucion").textContent = data.resuelto && data.fechaResolucion
                ? data.fechaResolucion
                : "Sin resolver";

            const modal = new bootstrap.Modal(document.getElementById("modalReporte"));
            modal.show();
        })
        .catch(error => {
            console.error("Error al cargar reporte:", error);
        });
}