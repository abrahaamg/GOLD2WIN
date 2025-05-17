var idUltimoClicado = -1;

const expulsionModal = document.getElementById('expulsionModal');
const expulsionDateInput = document.getElementById('expulsionDate');
const expulsionTimeInput = document.getElementById('expulsionTime');
const confirmBtn = document.getElementById('confirmExpulsionBtn');
const updateBtn = document.getElementById('updateExpulsionBtn');

document.addEventListener('DOMContentLoaded', function() {
    const botones = document.querySelectorAll('.abridorModalExpulsion');
    botones.forEach(function(boton) {
        boton.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const nombre = this.getAttribute('data-nombre');
            const fechaActual = this.getAttribute('data-fecha');

            abrirModal(id, nombre, fechaActual);
            idUltimoClicado = id;
        });
    });

    confirmBtn.addEventListener('click', function() {
        confirmarExpulsion();
    });

    updateBtn.addEventListener('click', function() {
        confirmarExpulsion();
    });

});

function abrirModal(id, nombre, fechaActual){
    document.getElementById('expulsionModalLabel').textContent = `Gestionar expulsión de ${nombre}`;
    idUltimoClicado = id;

    if (fechaActual) {
        setDateTimeInputs(fechaActual);
        confirmBtn.classList.add('d-none');
        updateBtn.classList.remove('d-none');
    } else {
        expulsionDateInput.value = '';
        expulsionTimeInput.value = '';
        confirmBtn.classList.remove('d-none');
        updateBtn.classList.add('d-none');
    }

    const modal = new bootstrap.Modal(expulsionModal);
    modal.show();
}

function setDateTimeInputs(fechaActual) {
    if (!fechaActual) {
        expulsionDateInput.value = '';
        expulsionTimeInput.value = '';
        return;
    }

    const dateObj = new Date(fechaActual);

    if (isNaN(dateObj)) {
        // Fecha inválida, limpiar inputs
        expulsionDateInput.value = '';
        expulsionTimeInput.value = '';
        return;
    }

    // Formatear fecha YYYY-MM-DD
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    expulsionDateInput.value = `${year}-${month}-${day}`;

    // Formatear hora HH:mm
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    expulsionTimeInput.value = `${hours}:${minutes}`;
}

function confirmarExpulsion() {
    const fecha = expulsionDateInput.value;
    const hora = expulsionTimeInput.value;
    let fechaIntroducida = null;

    if(fecha){
        fechaIntroducida = new Date(fecha);

        if(hora){
            const [horas, minutos] = hora.split(':');

            fechaIntroducida.setHours(parseInt(horas));
            fechaIntroducida.setMinutes(parseInt(minutos));
        }

        fechaIntroducida = fechaIntroducida.toISOString();
    }

    go(config.rootUrl + "/admin/usuarios/" + idUltimoClicado + "/banear", "POST", {tipo:"0", fecha: fechaIntroducida})
    .then(function(response) {
        Location.reload();
    })
    .catch(function(error) {
        console.log(error);
    });
}   