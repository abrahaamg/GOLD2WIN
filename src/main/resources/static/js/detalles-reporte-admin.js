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
