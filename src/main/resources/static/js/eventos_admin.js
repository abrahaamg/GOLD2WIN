var isDarkMode = document.documentElement.getAttribute("data-bs-theme") === "dark";
var listaEtiquetas = new Set([]);;
var listaVariables = new Set([]);;
var listaNombresVariables = new Set([]);;
var tipoVariableModal = true; // false = texto, true = numerico

configurarflatpickr();

document.querySelectorAll(".cambiadorTema").forEach(elemento => {
    elemento.addEventListener("click", function () {
        isDarkMode = !isDarkMode;
        configurarflatpickr();
    });
});

function configurarflatpickr(){
    flatpickr("#datepicker", {
        locale: "es",  
        dateFormat: "Y-m-d",         
        altInput: true,
        minDate: new Date(),   
        altFormat: "j \\de F \\de Y",               
        allowInput: false,
        theme: isDarkMode ? "dark" : "light",
        onOpen: function(selectedDates, dateStr, instance) {
            instance.input.classList.add("focused");
        },
        onClose: function(selectedDates, dateStr, instance) {
            instance.input.classList.remove("focused");
        }
    });
    
    flatpickr("#timepicker", {
        viewMode: 'clock',
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i", 
        time_24hr: true ,  
        theme: isDarkMode ? "dark" : "light",
        onOpen: function(selectedDates, dateStr, instance) {
            instance.input.classList.add("focused");
        },
        onClose: function(selectedDates, dateStr, instance) {
            instance.input.classList.remove("focused");
        }
    });
}

document.getElementById("textoFechaModal").addEventListener("click", function() {
    document.getElementById("textoFechaModal").style.display = "none";
    document.getElementById("inputsFechaModal").style.display = "flex";
    document.getElementById('timepicker').focus();
});

document.getElementById("textoEtiquetasModal").addEventListener("click", function() {
    document.getElementById("textoEtiquetasModal").style.display = "none";
    document.getElementById("inputsEtiquetasModal").style.display = "flex";
    document.getElementById('inputVariable').focus();
});

/*CODIGO PARA EL SELECT*/
const select = document.getElementById('seccionSelect');

select.addEventListener('focus', () => {
    select.classList.remove('selectDiscreto');
    select.classList.remove('resaltaHover');
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
    document.getElementById("textoEtiquetasModal").style.display = "flex";
    document.getElementById("inputsEtiquetasModal").style.display = "none";

    document.getElementById("textoFechaModal").style.display = "flex";
    document.getElementById("inputsFechaModal").style.display = "none";

    document.getElementById(`contenedor${paginaActual}`).style.display = "none";
    document.getElementById(`contenedor${paginaElegida}`).style.display = "flex";
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
        anadirEtiquetaAlModal(inputEtiqueta.value.trim());
        inputEtiqueta.value = "";
    }
});


inputVariable.addEventListener("keydown", function(event) {
    if (event.key === 'Enter' && inputVariable.value.trim() !== "") {
        inputVariable.value = inputVariable.value.replace(/\s+/g, "_");
        anadirVariableAlModal({"nombre":inputVariable.value.trim(),"numerica":tipoVariableModal});
        inputVariable.value = "";
    }
});

function anadirEtiquetaAlModal(texto){
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

    botonEliminar.addEventListener("click", function() {
        contenedor.removeChild(componenteEtiqueta);
        listaEtiquetas.delete(texto);
    });
}

//variable tiene que estar en formato: {nombre: "nombre", numerica: true}
function anadirVariableAlModal(variable){
    const contenedor = document.getElementById("listaVariablesModal");

    if(listaNombresVariables.has(variable.nombre.toLowerCase()))
        return;

    listaVariables.add(variable);
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
    contenedor.insertBefore(componenteVariable, contenedor.firstChild);

    const botonEliminar = componenteVariable.querySelector("button");

    botonEliminar.addEventListener("click", function() {
        contenedor.removeChild(componenteVariable);
        listaVariables.delete(variable);
        listaNombresVariables.delete(variable.nombre.toLowerCase());
    });
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