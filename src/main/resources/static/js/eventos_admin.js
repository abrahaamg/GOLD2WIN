var isDarkMode = document.documentElement.getAttribute("data-bs-theme") === "dark";
var listaEtiquetas = new Set([]);
var listaVariables = new Set([]);
var listaNombresVariables = new Set([]);
var tipoVariableModal = true; // false = texto, true = numerico
var cargando = false;
var creando = false; //Indica si se está creando evento o editando uno existente
var viendoMas = false;
var id_evento_editado = -1;

var _datepicker;
var _timepicker;

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("timepicker").addEventListener("change", function() {
        if (!isValidTime(this.value)) {
            _timepicker.setDate(new Date().getDate() + 1, true);
        }
        else{
            actualizarTextoFecha();
        } 
    });
    
    document.getElementById("datepicker").addEventListener("change", function() {
        if (!isValidDate(this.value)) {
            _datepicker.setDate(new Date().getDate() + 1, true);
        }
        else{
            actualizarTextoFecha();
        } 
    });

    configurarflatpickr(new Date());

    document.querySelectorAll(".cambiadorTema").forEach(elemento => {
        elemento.addEventListener("click", function () {
            const idEvento = btn.getAttribute("data-id-evento");

            if(id_evento_editado != idEvento){
                id_evento_editado = idEvento;

                if (isDarkMode) {
                    document.documentElement.setAttribute("data-bs-theme", "light");
                    isDarkMode = false;
                } else {
                    document.documentElement.setAttribute("data-bs-theme", "dark");
                    isDarkMode = true;
                }
                configurarflatpickr(new Date());
            }
        });
    });
});

function configurarflatpickr(fecha){

    _datepicker = flatpickr("#datepicker", {
        locale: "es",  
        dateFormat: "Y-m-d",         
        altInput: false,
        minDate: creando ? new Date(): null,
        defaultDate: fecha,             
        allowInput: true,
        theme: isDarkMode ? "dark" : "light",
        onOpen: function(selectedDates, dateStr, instance) {
            instance.input.classList.add("focused");
        },
        onClose: function(selectedDates, dateStr, instance) {
            instance.input.classList.remove("focused");

            if (!isValidDate(dateStr)) {
                _datepicker.setDate(new Date(), true);
            }
            else{
                actualizarTextoFecha();
            } 
        },
    });
    
    _timepicker = flatpickr("#timepicker", {
        viewMode: 'clock',
        altInput: false,
        allowInput: true,
        enableTime: true,
        noCalendar: true,
        defaultDate: fecha, 
        dateFormat: "H:i", 
        time_24hr: true ,  
        theme: isDarkMode ? "dark" : "light",
        onOpen: function(selectedDates, dateStr, instance) {
            instance.input.classList.add("focused");
        },
        onClose: function(selectedDates, dateStr, instance) {
            instance.input.classList.remove("focused");

            if (!isValidTime(dateStr)) {
                _timepicker.setDate(new Date(), true);
            }
            else{
                actualizarTextoFecha();
            } 
        },
        onReady: function(selectedDates, dateStr, instance) {
            actualizarTextoFecha();
        }
    });
}

//Verifica si la fecha introducida es valida
function isValidDate(dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateStr);
}

//verifica si la hora introducida es valida
function isValidTime(timeStr) {
    const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(timeStr);
}

/*FUNCIONES PARA ALTERNAR EL MODO EDICION Y EL MODO CREACION DEL MODAL*/

function modalModoCreacion(){
    if(cargando == false){
        viendoMas = false;
        creando = true;
        id_evento_editado = -1;
        resetearModal();

        const campoTitulo = document.getElementById("inputNombreEvento");
        campoTitulo.disabled = false;
        campoTitulo.tabIndex = 0;
        document.getElementById('seccionSelect').disabled = false;
        document.getElementById('inputEtiqueta').disabled = false;
        document.getElementById("textoFechaModal").classList.add("resaltaHover"); 
        document.getElementById("inputEtiqueta").classList.add("resaltaHover"); 
        document.getElementById("textoVariablesModal").classList.add("resaltaHover"); 
        document.getElementById("submit-form-eventos").classList.remove("invisible");
        document.getElementById("textoVariablesModal").textContent = "Añadir variable"; 
    }
}

function modalModoEdicion(id){
    if(cargando == false){
        viendoMas = false;
        creando = false;
        id_evento_editado = id;
        resetearModal();
        
        const campoTitulo = document.getElementById("inputNombreEvento");
        campoTitulo.disabled  = true;
        campoTitulo.tabIndex = -1;
        document.getElementById('seccionSelect').disabled = true;
        document.getElementById('inputEtiqueta').disabled = false;
        document.getElementById("textoFechaModal").classList.add("resaltaHover"); 
        document.getElementById("inputEtiqueta").classList.add("resaltaHover"); 
        document.getElementById("textoVariablesModal").classList.add("resaltaHover"); 
        document.getElementById("submit-form-eventos").classList.remove("invisible");
        document.getElementById("textoVariablesModal").textContent = "Añadir variable"; 
    
        cargando = true;
        go(config.rootUrl + '/admin/eventos/cargarDatosEvento/' + id_evento_editado, 'GET').then((data) => {
            campoTitulo.value = data.nombre;
            configurarflatpickr(new Date(data.fechaCierre));
            document.getElementById('seccionSelect').value = data.seccion;

            data.etiquetas.forEach((etiqueta) => {
                anadirEtiquetaAlModal(etiqueta, true);
            });

            data.variables.forEach((variable) => {
                anadirVariableAlModal({"nombre":variable.nombre,"numerica":variable.numerico}, false);
            });

            cargando = false;
        }).catch((error) => {
            console.log(error);
            cargando = false;
        });
    }
}

function modalModoVerMas(id){
    if(cargando == false){
        creando = false;
        viendoMas = true;
        id_evento_editado = -1;
        resetearModal();
        
        const campoTitulo = document.getElementById("inputNombreEvento");
        campoTitulo.disabled  = true;
        campoTitulo.tabIndex = -1;
        document.getElementById('seccionSelect').disabled = true;
        document.getElementById('inputEtiqueta').disabled = true;
        document.getElementById("textoFechaModal").classList.remove("resaltaHover");
        document.getElementById("inputEtiqueta").classList.remove("resaltaHover");
        document.getElementById("textoVariablesModal").classList.remove("resaltaHover"); 
        document.getElementById("textoVariablesModal").textContent = "Todas las variables"; 
        document.getElementById("inputEtiqueta").value = "Todas las etiquetas";
        document.getElementById("submit-form-eventos").classList.add("invisible");
    
        cargando = true;
        go(config.rootUrl + '/admin/eventos/cargarDatosEvento/' + id, 'GET').then((data) => {
            campoTitulo.value = data.nombre;
            configurarflatpickr(new Date(data.fechaCierre));
            document.getElementById('seccionSelect').value = data.seccion;

            data.etiquetas.forEach((etiqueta) => {
                anadirEtiquetaAlModal(etiqueta,false);
            });

            data.variables.forEach((variable) => {
                anadirVariableAlModal({"nombre":variable.nombre,"numerica":variable.numerico}, false);
            });

            cargando = false;
        }).catch((error) => {
            console.log(error);
            cargando = false;
        });

    }
}

/*FUNCIONES PARA EL MENU DEL MODAL*/
document.getElementById("textoFechaModal").addEventListener("click", function() {
    if(!viendoMas){
        document.getElementById("textoFechaModal").style.display = "none";
        document.getElementById("inputsFechaModal").style.display = "flex";
        document.getElementById('timepicker').focus();
    }
});

document.getElementById("textoVariablesModal").addEventListener("click", function() {
    if(!viendoMas){
        document.getElementById("textoVariablesModal").style.display = "none";
        document.getElementById("inputsEtiquetasModal").style.display = "flex";
        document.getElementById('inputVariable').focus();
    }
});

function actualizarTextoFecha(){
    const opciones = {
        weekday: 'long',   // lunes, martes...
        day: 'numeric',
        month: 'long'      // enero, febrero...
    };

    const fechaInput = document.getElementById("datepicker");
    const horaInput = document.getElementById("timepicker");
    const spanFecha = document.getElementById("spanFecha");
    const spanHora = document.getElementById("spanHora");

    const formateador = new Intl.DateTimeFormat('es-ES', opciones);
    const fechaFormateada = formateador.format(new Date(fechaInput.value));
    spanFecha.textContent = fechaFormateada;
    spanHora.textContent = formatearHora(horaInput.value);
}

function formatearHora(hora){
    const partes = hora.split(":");
    const horas = parseInt(partes[0], 10);
    const minutos = parseInt(partes[1], 10);
    var salida = "";
    salida = `${Math.trunc(partes[0]%12)}:${partes[1]}`;

    if(horas <= 12)
        salida += " am";
    else
        salida += " pm";

    return salida;
}

/*CODIGO PARA EL SELECT*/
const select = document.getElementById('seccionSelect');

select.addEventListener('focus', () => {
    if(creando){
        select.classList.remove('selectDiscreto');
        select.classList.remove('resaltaHover');
    }
});

select.addEventListener('blur', () => {
    select.classList.add('selectDiscreto');
    select.classList.add('resaltaHover');
});

/*CODIGO PARA EL MENU*/
var paginaActual = "Eventos";

document.getElementById("botonEventos").addEventListener("click", function() {
    cambiarMenu("Eventos");
});

document.getElementById("botonEtiquetas").addEventListener("click", function() {
    cambiarMenu("Etiquetas");
});

document.getElementById("botonVariables").addEventListener("click", function() {
    cambiarMenu("Variables");
});

function cambiarMenu(paginaElegida){
    document.getElementById("textoVariablesModal").style.display = "flex";
    document.getElementById("inputsEtiquetasModal").style.display = "none";

    document.getElementById("textoFechaModal").style.display = "flex";
    document.getElementById("inputsFechaModal").style.display = "none";

    document.getElementById(`contenedor${paginaActual}Modal`).style.display = "none";
    document.getElementById(`contenedor${paginaElegida}Modal`).style.display = "flex";
    document.getElementById(`boton${paginaActual}`).classList.remove("active");
    document.getElementById(`boton${paginaElegida}`).classList.add("active");
    paginaActual = paginaElegida;
}

/*AÑADIR ETIQUETAS Y VARIABLES MODAL*/
const inputEtiqueta = document.getElementById("inputEtiqueta");
const inputVariable = document.getElementById("inputVariable");

inputEtiqueta.addEventListener("keydown", function(event) {
    if (event.key === 'Enter' && inputEtiqueta.value.trim() !== "") {
        inputEtiqueta.value = inputEtiqueta.value.replace(/\s+/g, "_");
        anadirEtiquetaAlModal(inputEtiqueta.value.trim(),true);
        inputEtiqueta.value = "";
    }
});


inputVariable.addEventListener("keydown", function(event) {
    if (event.key === 'Enter' && inputVariable.value.trim() !== "") {
        inputVariable.value = inputVariable.value.replace(/\s+/g, "_");
        anadirVariableAlModal({"nombre":inputVariable.value.trim(),"numerica":tipoVariableModal}, true);
        inputVariable.value = "";
    }
});

function anadirEtiquetaAlModal(texto, eliminable){
    const contenedor = document.getElementById("listaEtiquetasModal");

    if(listaEtiquetas.has(texto))
        return;

    listaEtiquetas.add(texto);

    var html = `
    <div class="d-flex flex-grow-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-tag" viewBox="0 0 16 16">
            <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0"/>
            <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1m0 5.586 7 7L13.586 9l-7-7H2z"/>
        </svg>

        <span class="ms-2">${texto}</span>
        <button class="ms-auto resaltaHover d-flex" style="min-height: 20; min-width: 20;border-radius: 50%;border:none; background-color: transparent;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square m-auto" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
            </svg>
        </button>
    </div>
    `;

    var componenteEtiqueta = document.createElement("div");
    componenteEtiqueta.className = "d-flex flex-grow-1";
    componenteEtiqueta.innerHTML = html;
    contenedor.insertBefore(componenteEtiqueta, contenedor.firstChild);

    const botonEliminar = componenteEtiqueta.querySelector("button");

    if(eliminable){
        botonEliminar.addEventListener("click", function() {
            contenedor.removeChild(componenteEtiqueta);
            listaEtiquetas.delete(texto);
        });
    }
    else{
        botonEliminar.remove();
        componenteEtiqueta.style.backgroundColor = "rgba(0, 0, 252, 0.1)";
    }
    
}

//variable tiene que estar en formato: {nombre: "nombre", numerica: true}
function anadirVariableAlModal(variable, eliminable){
    const contenedor = document.getElementById("listaVariablesModal");

    if(listaNombresVariables.has(variable.nombre.toLowerCase()))
        return;

    listaVariables.add({nombre: variable.nombre, numerica: variable.numerica, eliminable: eliminable});
    listaNombresVariables.add(variable.nombre.toLowerCase());
    
    var html = `           
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-seam my-auto" viewBox="0 0 16 16">
            <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>
        </svg>

        <div class="d-flex flex-column ms-2">
            <span class="ms-2">${variable.nombre}</span>
            <span class="ms-2" style="font-size: 11px;">${variable.numerica ? "Numérica" :"Texto"}</span>
        </div>

        <button class="ms-auto resaltaHover d-flex" style="min-height: 20; min-width: 20;border-radius: 50%;border:none; background-color: transparent;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square m-auto" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
            </svg>
        </button>
    `;

    var componenteVariable = document.createElement("div");
    componenteVariable.className = "d-flex flex-grow-1";
    componenteVariable.innerHTML = html;
    const botonEliminar = componenteVariable.querySelector("button");

    if(eliminable){
        botonEliminar.addEventListener("click", function() {
            contenedor.removeChild(componenteVariable);
            listaVariables.delete(variable);
            listaNombresVariables.delete(variable.nombre.toLowerCase());
        });
    }
    else{
        botonEliminar.remove();
        componenteVariable.style.backgroundColor = "rgba(0, 0, 252, 0.1)";
    }

    contenedor.insertBefore(componenteVariable, contenedor.firstChild);
}

/*TOGLE TIPO DE VARIABLE*/
document.getElementById("tipoVariableModal").addEventListener("click", function() {
    tipoVariableModal = !tipoVariableModal;
    const componente = document.getElementById("tipoVariableModal");
    if(tipoVariableModal)
        componente.textContent = "Numérica";
    else 
        componente.textContent = "Texto";
});

/*funciones para limpiar modal*/
function eliminarVariablesModal(){
    const contenedorVariables = document.getElementById("listaVariablesModal");
    while (contenedorVariables.firstChild) {
        contenedorVariables.removeChild(contenedorVariables.firstChild);
    }

    listaVariables.clear();
    listaNombresVariables.clear();
}

function eliminarEtiquetasModal(){
    const contenedorEtiquetas = document.getElementById("listaEtiquetasModal");
    while (contenedorEtiquetas.firstChild) {
        contenedorEtiquetas.removeChild(contenedorEtiquetas.firstChild);
    }

    listaEtiquetas.clear();
}

function resetearModal(){
    document.getElementById("inputNombreEvento").value = "";
    document.getElementById("inputEtiqueta").value = "";
    document.getElementById("inputVariable").value = "";
    document.getElementById("seccionSelect").selectedIndex = 0;

    cambiarMenu("Eventos");
    configurarflatpickr(new Date());

    eliminarEtiquetasModal();
    eliminarVariablesModal();
}

//Funcion para que al seleccionar seccion se pongan las variables de la plantilla
document.getElementById("seccionSelect").addEventListener("change", function() {
    if(!cargando){
        cargando = true;

        const seccionSeleccionada = this.value;
        const contenedorVariables = document.getElementById("listaVariablesModal");

        while (contenedorVariables.firstChild) {
            contenedorVariables.removeChild(contenedorVariables.firstChild);
        }

        listaNombresVariables.clear();

        if (seccionSeleccionada !== "") {
            
            go(config.rootUrl + '/admin/eventos/getVariablesSeccion/' + seccionSeleccionada, 'GET').then((data) => {
                cargando = false;
    
                for (let key in data) {
                    const esNumerica = data[key];
                    anadirVariableAlModal({"nombre":key,"numerica":esNumerica}, true);
                }
            }).catch((error) => {
                console.log(error);
                cargando = false;
            });
        }
    }
    
});

/* FUNCION PARA CREAR EVENTO */

document.getElementById("submit-form-eventos").addEventListener("click", function() {
    if(cargando == false){
        const nombreEvento = document.getElementById("inputNombreEvento").value.trim();
        const dia = _datepicker.selectedDates[0];
        const hora = _timepicker.selectedDates[0];
        const seccion = document.getElementById("seccionSelect").value;
        const etiquetas = Array.from(listaEtiquetas);
        const variables = Array.from(listaVariables).filter(variable => variable.eliminable);
        const textoError = document.getElementById("notificacion-error");

        if (!dia || !hora) {
            return null; // Si alguno no está seleccionado
        }

        const fecha = new Date(
            dia.getFullYear(),
            dia.getMonth(),
            dia.getDate(),
            hora.getHours(),
            hora.getMinutes()
        );

        if (fecha <= new Date() && creando) {
            textoError.textContent = "La fecha y hora deben ser posteriores a la actual.";
            textoError.style.display = "block";
            return;
        }

        if (seccion === "" && creando) {
            textoError.textContent = "Debe seleccionar una sección.";
            textoError.style.display = "block";
            return;
        }

        if (etiquetas.length < 1 && creando) {
            textoError.textContent = "Debe añadir al menos una etiqueta.";
            textoError.style.display = "block";
            return;
        }

        if (variables.length < 1 && creando) {
            textoError.textContent = "Debe añadir al menos una variable.";
            textoError.style.display = "block";
            return;
        }

        if(nombreEvento.length < 1 && creando){
            textoError.textContent = "El nombre del evento no puede estar vacío.";
            textoError.style.display = "block";
            return;
        }

        //El go es lo unico asincrono
        cargando = true;

        go(config.rootUrl + '/admin/eventos/crearEvento', 'POST', {
            nombre: nombreEvento,
            fecha: fecha.toISOString(),
            seccion: parseInt(seccion),
            etiquetas: etiquetas,
            variables: variables,
            idEvento: id_evento_editado
        }).then((data) => {
            cargando = false;
            if(data.success)
                //se ha guardado con exito
                location.reload(true)
            else{
                //algun error al comprobar los datos en el servidor
                textoError.textContent = data.error;
                textoError.style.display = "block";
            }
        }).catch((error) => {
            console.log(error);
            cargando = false;
        });
    }
});

/*cancelar evento*/
function cancelarEvento(id){
    console.log("cancelar evento");
    if(cargando == false){
        cargando = true;
        go(config.rootUrl + '/admin/eventos/cancelar/' + id, 'POST').then((data) => {
            cargando = false;
            if(data.success);
                location.reload(true)
        }).catch((error) => {
            console.log(error);
            cargando = false;
        });
    }
}