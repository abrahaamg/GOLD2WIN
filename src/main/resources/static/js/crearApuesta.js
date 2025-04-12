const appRoot = document.getElementById('root').value; // th:href="@{/}"
const currentPath = window.location.pathname;
const botonVerMas = document.getElementById("verMasEventos");
var offset = 0; // numElementos cargados
var buscado = null; // indica la ultima busqueda realizada (para sobre la busqueda ver mas)
let fechaInicio = new Date().toISOString(); // fecha en que se trajeron eventos por primera vez (para evitar que las cosas se descuadren)
var cargando = true;

cargarFormulas().then(() => {
    cargando = false;});

botonVerMas.addEventListener("click", function() {
    if(!cargando){
        cargando = true;
        cargarFormulas().then(() => {
            cargando = false;
        }).catch((error) => {
            cargando = false;
            console.log(error);
        });
    }
});

/* FUNCION PARA LA LUPA */
document.getElementById("queryApuestas").addEventListener("keypress", function(event) {
    if (event.key === "Enter" && !cargando) {
        cargando = true;
        var busqueda = document.getElementById("queryApuestas").value;

        if (busqueda == "") { //si no hay nada escrito se cargan los eventos por defecto
            if(buscado != null){
                fechaInicio = new Date().toISOString();
                buscado = null;
                vaciarContenedorFormulas();
                offset = 0;

                cargarFormulas().then(() => {
                    cargando = false;
                }).catch((error) => {
                    cargando = false;
                    console.log(error);
                });
            }
            else{
                cargando = false;
            }
        }
        else if(buscado != busqueda){
            offset = 0;
            fechaInicio = new Date().toISOString();
            buscado = busqueda;
            vaciarContenedorFormulas();

            cargarFormulas().then(() => {
                cargando = false;
            }).catch((error) => {
                cargando = false;
                console.log(error);
            });
        }
    }
});

function vaciarContenedorFormulas(){
    contenedor = document.getElementById("contendorFormulas");

    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
}

async function cargarFormulas(){
    botonVerMas.disabled = true; 

    try{
        var response;

        if(buscado == null)
            response = await go(currentPath+ '/cargarMas' + '?fechaInicio=' + fechaInicio + '&offset=' + offset, 'GET');
        else 
            response = await go(currentPath+ '/buscar' + '?fechaInicio=' + fechaInicio +'&busqueda=' + buscado +'&offset=' + offset, 'GET');

        response.formulas.forEach(formula => {
            anadirFormula(formula);
        });

        if(response.hayMasFormulas){
            botonVerMas.disabled = false;
            botonVerMas.style.display = "block";
        }
        else{
            botonVerMas.style.display = "none";
        }

        offset += response.formulas.length;
        console.log(response)
    } catch(error){
        console.error('Error:', error);
    }
}

function anadirFormula(formula){
    let elementoHTML = document.createElement("div");
    elementoHTML.className = "d-flex flex-column contenedor-apuesta";
    elementoHTML.style= "position: relative;";
    elementoHTML.id = "formula-" + formula.id;
    elementoHTML.innerHTML = 
        `
        <h5 class="pb-2 border-bottom"> ${formula.nombre}</h5>
        <div id="descripcion-contendor-apuesta">
            <div class="d-flex align-items-start mb-2">
                <span class="titulo-campo-apuesta me-2">Formula:</span>
                <div class="border w-100 scrollBarPerso contenedor-info">
                    <span class="spanAdaptable" style="white-space: nowrap;"> ${formula.formula}</span>
                </div>
            </div>
            <div >
                <span class="titulo-campo-apuesta">Cuota favorable:</span>
                <span class="text-success"> ${formula.cuotaFaborable}</span>
            </div>
            <div >
                <span class="titulo-campo-apuesta">Cuota desfavorable:</span>
                <span class="text-success">${formula.cuotaDesfavorable}</span>
            </div>
        </div>
        
        <div id="cuestionario-form-${formula.id}" class="w-100 d-flex align-items-center mt-3">
            <button type="button" class="btn btn-success botonApostarFavorable" onclick="enviarFormulario(true,${formula.id})">
                favorable
            </button>

            <input type="number" id="cantidad-${formula.id}" class ="form-control mx-2 flex-grow-1" placeholder="cantidad..." required>

            <button type="button" class="btn btn-success botonApostarDesfavorable" onclick="enviarFormulario(false,${formula.id})">
                desfavorable
            </button>
        </div>

        <svg id="confirmacionApuesta-${formula.id}" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class=" confirmacionApuesta bi bi-check-circle-fill text-success invisible" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>
        `;

    document.getElementById("contendorFormulas").appendChild(elementoHTML);
}


/*  CODIGO PARA EL MODAL Y LAS APUESTAS  */

//cuando abres el model siempre está en la primera pestaña
document.getElementById("boton-crear-formula").addEventListener("click", () => { 
    mostrarModal();

});

document.getElementById("boton-crear-formula-reducido").addEventListener("click", () => { 
    mostrarModal();
});

function mostrarModal(){
    console.log("entra");
    var elementos1 = document.querySelectorAll('.vision-creatuApuesta-1');
    var elementos2 = document.querySelectorAll('.vision-creatuApuesta-2');

    elementos1.forEach(function(elemento) {
        elemento.classList.remove('desaparece');
    });

    elementos2.forEach(function(elemento) {
        elemento.classList.add('desaparece');
    });

    document.getElementById("botonRetrocederCrearApuesta").classList.add('invisible');
}

document.getElementById("botonSiguienteCrearApuesta").addEventListener("click", () => {
    console.log("entra");
    var elementos1 = document.querySelectorAll('.vision-creatuApuesta-1');
    var elementos2 = document.querySelectorAll('.vision-creatuApuesta-2');

    var titulo = document.getElementById('tituloModal');
    var formula = document.getElementById('formulaModal');

    if(titulo.checkValidity() && formula.checkValidity()){
        elementos1.forEach(function(elemento) {
            elemento.classList.add('desaparece');
        });

        elementos2.forEach(function(elemento) {
            elemento.classList.remove('desaparece');
        });

        document.getElementById("botonRetrocederCrearApuesta").classList.remove('invisible');
    }

});

document.getElementById("botonRetrocederCrearApuesta").addEventListener("click", () => {
    var elementos1 = document.querySelectorAll('.vision-creatuApuesta-1');
    var elementos2 = document.querySelectorAll('.vision-creatuApuesta-2');

    elementos1.forEach(function(elemento) {
        elemento.classList.remove('desaparece');
    });

    elementos2.forEach(function(elemento) {
        elemento.classList.add('desaparece');
    });

    document.getElementById("botonRetrocederCrearApuesta").classList.add('invisible');
});

document.getElementById("crearApuestaForm").addEventListener("submit", function(event) {
    event.preventDefault();
    if( !enviandoFormulario ){
        enviandoFormulario = true;
        const ruta = window.location.pathname.replace("apostar", "crearFormula");
        const titulo = document.getElementById("tituloModal").value;
        const formula = document.getElementById("formulaModal").value;
        const cantidad = parseFloat(document.getElementById("cantidadModal").value);
        const tipoApuesta = document.getElementById("tipoApuestaModal").value == "favorable";

        goTexto(ruta, 'POST', {titulo,formula,cantidad,tipoApuesta}).then((response) => {
            if(response == "OK"){
                document.getElementById("ocultador-formulario2").classList.add("invisible");
                let check = document.getElementById("confirmacionApuesta2");
                check.classList.remove("invisible");
                check.style.animation = "fadeIn 0.5s ease-in-out";

                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
            else{
                if(response == "ERROR-TITULO"){
                    document.getElementById("tituloModal").classList.add("border", "border-danger");
                    mostrarModal();
                }
                else if(response == "ERROR-FORMULA"){
                    document.getElementById("formulaModal").classList.add("border", "border-danger");
                    mostrarModal();
                }
                else if(response == "ERROR-CANTIDAD")
                    document.getElementById("cantidadModal").classList.add("border", "border-danger");
                else if(response == "ERROR-TIPO")
                    document.getElementById("tipoApuestaModal").classList.add("border", "border-danger");
                else
                    console.log(response);

                enviandoFormulario = false;
            }
        }).catch((error) => {
            enviandoFormulario = false;
        });
    }
});

var enviandoFormulario = false; // Para evitar que si clicas varias veces en el mismo botón apuestes varias veces

function enviarFormulario(esFavorable,id) {
    var input = document.getElementById("cantidad-"+id);
    
    if(!enviandoFormulario && input.value != ""){
        enviandoFormulario = true;
        const cantidad = parseFloat(input.value);
        const idFormula = id;
        const decision = esFavorable;

        console.log({idFormula,decision,cantidad});

        goTexto(appRoot+ 'evento/apostar', 'POST', {idFormula,decision,cantidad}).then((response) => {
            if(response == "OK"){
                const contenedorFormula = document.getElementById("formula-"+id);

                //Todos los hijos invisibles
                for (let child of contenedorFormula.children) {
                    child.classList.add("invisible");
                }

                let check = document.getElementById("confirmacionApuesta-"+id);
                check.classList.remove("invisible");
                check.style.animation = "fadeIn 0.5s ease-in-out";

                setTimeout(() => {
                    location.reload();  // Recarga la página
                }, 1500);
            }
            else{
                console.log(response);
                input.classList.add("border", "border-danger"); 
                enviandoFormulario = false;
            }
        }).catch((error) => {
            console.log(error);
            enviandoFormulario = false;
        });
    }
}