/*FUNCIONES PARA EL MODO OSCURO/CLARO */

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r
    }, null);
}

function applyThemeFromCookie() {
    let theme = getCookie('theme');

    // Si no hay cookie, se crea con valor "oscuro"
    if (!theme) {
        theme = 'oscuro';
        setCookie('theme', theme, 365); 
    }

    const html = document.documentElement;

    if (theme === 'oscuro') {
        html.setAttribute('data-bs-theme', 'dark');
    } else {
        html.removeAttribute('data-bs-theme');
    }
}

document.querySelectorAll(".cambiadorTema").forEach(elemento => {
    elemento.addEventListener("click", function () {
        const html = document.documentElement;
        let theme = getCookie('theme');

        if (theme === 'oscuro' || theme === null) {
            theme = 'claro';
            html.removeAttribute('data-bs-theme');
            setCookie('theme', theme, 365); 
        }
        else{
            theme = 'oscuro';
            html.setAttribute('data-bs-theme', 'dark');
            setCookie('theme', theme, 365); // dura 1 año
        }
    });
});

// Ejecutar al cargar la página
applyThemeFromCookie();

/* OTRAS FUNCIONES GLOBALES*/

function actualizarTiempoRestante() {
    console.log("entra1");
    const elementosTiempoRestante = document.querySelectorAll(".tiempo-restante");
    elementosTiempoRestante.forEach((elemento) => {
        console.log("entra");
        const fechaEventoStr = elemento.getAttribute("data-fecha-evento");  
        if (!fechaEventoStr) return;

        // Convertir la cadena a una fecha en JavaScript
        const fechaEvento = new Date(fechaEventoStr.replace(" ", "T")); // Reemplaza el espacio con 'T' para compatibilidad

        // Obtener la fecha actual
        const ahora = new Date();

        // Calcular la diferencia en milisegundos
        const diferencia = fechaEvento - ahora;

        if (diferencia <= 0) {
            elemento.textContent = "Evento iniciado";
            return;
        }
        
        // Convertir la diferencia en días, horas y minutos
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

        // Mostrar la salida en el formato adecuado
        if (dias > 0) {
            elemento.textContent = `${dias} días`;
        } else {
            elemento.textContent = `${horas}h ${minutos}m`;
        }
    });
}

var tiempoRestanteAux = document.querySelectorAll(".tiempo-restante");
if(tiempoRestanteAux.length != 0){
    actualizarTiempoRestante();
    setInterval(actualizarTiempoRestante, 60000); // Actualizar cada minuto
}

document.querySelectorAll(".botonDesplegable").forEach(cell => {
    cell.addEventListener("click", () => {
    const svg = cell.querySelector("svg");
    if (svg.classList.contains("iconoFlechaDesplegableAbajo")) {
        svg.innerHTML = `<path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z"/>`;
        svg.classList.replace("iconoFlechaDesplegableAbajo", "iconoFlechaDesplegableArriba");
    } else {
        svg.innerHTML = `<path fill-rule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67"/>`
        svg.classList.replace("iconoFlechaDesplegableArriba", "iconoFlechaDesplegableAbajo");
    }
    });
});

document.querySelectorAll(".colsCuotasVerificadasInc").forEach(cell => {
    cell.addEventListener("click", () => {
    const svg = cell.querySelector("svg");
    if (svg.classList.contains("iconoCruzApuesta")) {
        svg.innerHTML = `<path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>`;
        svg.classList.replace("iconoCruzApuesta", "iconoCheckApuesta");
        cell.style.color = "#A78BFA";
        svg.setAttribute("width", 25);
        svg.setAttribute("height", 25);
    } else {
        svg.innerHTML = `<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>`
        svg.classList.replace("iconoCheckApuesta", "iconoCruzApuesta");
        cell.style.color = "white";
        svg.setAttribute("width", 16);
        svg.setAttribute("height", 16);
    }
    });
});

var botonIzSecciones = document.getElementById("btnIzSecciones");
if(botonIzSecciones != null){
    botonIzSecciones.addEventListener("click", function(event){
        var contenedor = document.getElementById("menuSeccionesComprimido");
        contenedor.scrollLeft -= contenedor.clientWidth/2;

    });
}

var botonDrsecciones = document.getElementById("btnDrSecciones");
if(botonDrsecciones != null){
    botonDrsecciones.addEventListener("click", function(event){
        var contenedor = document.getElementById("menuSeccionesComprimido");
        contenedor.scrollLeft += contenedor.clientWidth/2;

    });
}

var inputImagenSeccionesForm = document.getElementById("inputImagenSecciones");
if(inputImagenSeccionesForm != null){
    document.getElementById('inputImagenSecciones').addEventListener('change', function(event) {
        var file = event.target.files[0]; // Obtener el archivo seleccionado
        if (file) {
            var reader = new FileReader(); 
            reader.onload = function(e) {
                var imgPreview = document.getElementById('mostrarImagenSeccionesForm');
                imgPreview.src = e.target.result; // Mostrar la imagen
                imgPreview.style.display = "block"; // Hacer visible la vista previa
            }
            reader.readAsDataURL(file);
        }
    });
}

var menuOpcionesSeccionForm = document.getElementById("menuOpcionesSeccion");
let seccionSeleccionadaId = null; 
if(menuOpcionesSeccionForm != null){
    const contextMenu = document.getElementById("menuOpcionesSeccion");
    const contextAreas = document.querySelectorAll(".enlaceSeccionAdmin");

    contextAreas.forEach((contextArea) => {
    contextArea.addEventListener("contextmenu", function(event) {
                event.preventDefault(); 

                seccionSeleccionadaId = this.getAttribute("data-id"); 
                console.log("Sección seleccionada:", seccionSeleccionadaId);

                contextMenu.style.display = "block";
                contextMenu.style.left = `${event.pageX}px`;  // Establece la posición en el eje X
                contextMenu.style.top = `${event.pageY}px`;   // Establece la posición en el eje Y
    });
    });

        // Ocultar el menú al hacer clic en cualquier otra parte
    document.addEventListener("click", function() {
        contextMenu.style.display = "none"; 
    });
}

var contenedorVariablesForm = document.getElementById("contenedorVariables");
if(contenedorVariablesForm != null){
    function agregarDiv() {
        const contenedor = document.getElementById("contenedorVariables");
        var nombre = document.getElementById('inputnombreVarNueva').value.trim();
        var select = document.getElementById('selectTipoVarNueva');
        var opcionSeleccionada = select.options[select.selectedIndex].text;
    
        if (opcionSeleccionada === "Seleccione una" || nombre === "") { //Si los campos están vacíos, no se añade el div
            return;  
        }
    
        // Crear un nuevo div con Bootstrap
        const nuevoDiv = document.createElement("div");
        nuevoDiv.className = "col-3 variableSeccion"; // Se organizan en 3 columnas por fila
        nuevoDiv.innerHTML = `
            <div id = "divEtiquetasVariables">
                <span>Nombre:</span>
                <span class = "nombreVariableSpan"> ${nombre}</span>
            </div>
            <div id = "divEtiquetasVariables">
                <span>Tipo de variable:</span>
                <span class = "tipoVariableSpan">${opcionSeleccionada}</span>
            </div>
        `;
    
        contenedor.appendChild(nuevoDiv); // Agrega el div al contenedor
        document.getElementById('selectTipoVarNueva').selectedIndex = 0;
        document.getElementById('inputnombreVarNueva').value = '';
    };
}

//window.eliminarSeccion = eliminarSeccion;
//window.guardarSeccion = guardarSeccion;
    
function eliminarSeccion() {
    //event.preventDefault();
    go(`/admin/eliminarSeccion/${seccionSeleccionadaId}`, "DELETE")
    .then(data => {
        console.log("Sección eliminada:", data.mensaje);
        window.location.href = "/admin/secciones";
    })
    .catch(error => console.error("Error al eliminar la sección:", error));
}    

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

async function guardarSeccion(event) {
    event.preventDefault();

    let formulario = document.getElementById("formularioSeccion");

    if (!formulario.checkValidity()) { //esto sirve para los mensajes de required cuando arriba esta rel preventDefault
        formulario.reportValidity(); 
        return;
    }

    const isNombreValido = await verificarNombreSeccion();
    if(isNombreValido){
        const nombre = document.getElementById("inputNombreSeccion").value.trim(); //el trim elimina espacios en blanco innecesarios
        const tipo = document.getElementById("inputTipoSeccion").value.trim();
        const file = document.getElementById("inputImagenSecciones").files[0] || null;

        const nombreS = nombre.charAt(0).toUpperCase() + nombre.slice(1);
        const tipoS = tipo.charAt(0).toUpperCase() + tipo.slice(1);

        let base64Image = await toBase64(file);

        if(nombreS != "" && tipoS != "" && file != null){
            const divs = document.querySelectorAll("#contenedorVariables .variableSeccion");
            const variables = [];

            divs.forEach(div => {
                const nombreV = div.querySelector(".nombreVariableSpan").innerText;
                const tipoV = div.querySelector(".tipoVariableSpan").innerText;
                variables.push({ nombreV, tipoV });
            });

            const jsonData = {
                seccionN: { nombre: nombreS, tipo: tipoS },
                imageData: { // Aquí se incluye la imagen
                    image: base64Image,
                    filename: file.name
                },
                arrayVariables: variables
            };

            go(`/admin/guardarSeccion`, "POST", jsonData)
            .then(data => {
                console.log("Respuesta recibida:", data.mensaje);
                //formulario.reset();
                //document.getElementById("mostrarImagenSeccionesForm").style.display = "none";
                //document.getElementById("contenedorVariables").innerHTML = `
                //<button id = "botonCrearVariable" style="min-height: 30px; max-height: 80px;" class = "col-3 btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalCrearVariables" type = "button"> 
                //    Crear variable
                //</button>
                //`;
                window.location.href = "/admin/secciones";
            })
            .catch(error => console.error("Error go:", error));
        }
    }
    else{
        event.preventDefault();
    }
}    

async function verificarNombreSeccion(){
    const nombreS = document.getElementById("inputNombreSeccion").value.trim();
    if (nombreS === "") return; 
  
    try {
        const response = await fetch(`/admin/verificarSeccion?nombre=${encodeURIComponent(nombreS)}`);
        const data = await response.json();
    
        if (data.existe) {
          document.getElementById("inputNombreSeccion").classList.add("is-invalid");
          document.getElementById("mensajeError").classList.add("invalid-feedback");
          console.log("false");
          return false; // Devolvemos false si el nombre existe.
        } else {
          document.getElementById("inputNombreSeccion").classList.remove("is-invalid");
          document.getElementById("mensajeError").classList.remove("invalid-feedback");
          console.log("true");
          return true; // Devolvemos true si el nombre no existe.
        }
      } catch (error) {
        console.error("Error al verificar el nombre:", error);
        return false; // Devuelve false en caso de error.
      }
}

async function editarSeccion(event) {
    event.preventDefault();

    let formularioEditar = document.getElementById("formularioSeccion");

    if (!formularioEditar.checkValidity()) { //esto sirve para los mensajes de required cuando arriba esta rel preventDefault
        formularioEditar.reportValidity(); 
        return;
    }
    const nombreS = document.getElementById("inputNombreSeccion").value.trim(); //el trim elimina espacios en blanco innecesarios
    const tipo = document.getElementById("inputTipoSeccion").value.trim();
    const file = document.getElementById("inputImagenSecciones").files[0] || null;

    const tipoS = tipo.charAt(0).toUpperCase() + tipo.slice(1);

    let base64Image = null;
    let fileName = null;
    if (file != null) {base64Image = await toBase64(file); fileName = file.name;}

    if(nombreS != "" && tipoS != ""){
        const divs = document.querySelectorAll("#contenedorVariables .variableSeccion");
        const variables = [];

        divs.forEach(div => {
            const nombreV = div.querySelector(".nombreVariableSpan").innerText;
            const tipoV = div.querySelector(".tipoVariableSpan").innerText;
            variables.push({ nombreV, tipoV });
        });

        const jsonData = {
            seccionN: { nombre: nombreS, tipo: tipoS },
            imageData: { // Aquí se incluye la imagen
                image: base64Image,
                filename: fileName
            },
            arrayVariables: variables
        };

        console.log("pregoEditar");
        go(`/admin/editarSeccion`, "POST", jsonData)
        .then(data => {
            console.log("Respuesta recibida:", data.mensaje);
            window.location.href = "/admin/secciones";
        })
        .catch(error => console.error("Error go:", error));
    }
}

var variableSeccionesForm = document.getElementById("variableSeccionForm");

if(variableSeccionesForm != null){
    document.getElementById("variableSeccionForm").addEventListener("submit", function(event) {
        event.preventDefault();
    });
}

