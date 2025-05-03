const appRoot = document.getElementById('root').value; //th:href="@{/}"
const seccionId = document.getElementById("seccionId").value; //Id de la sección de la que se quieren los elementos
var fechaInicio = new Date().toISOString(); //fecha en la que se almacena el primer evento
const botonVerMas = document.getElementById("verMasEventos"); //el boton que esta abajo del contenedor de eventos (todo debe ser insertado antes)
var offset = 0; //numElementos cargados
var buscado = null; //indica la ultima busqueda realizada (para sobre la busqueda ver mas)
let fechaAnterior = new Date(0); //fecha del ultimo evento cargado (para separar por dias)

var cargando = true

cargarEventos().then(() => {
    cargando = false;
});

//FUNCIONES PARA LA BARRA BUSCADORA

document.getElementById("queryEventos").addEventListener("keypress", function(event) {
    if (event.key === "Enter" && !cargando) {
        var busqueda = document.getElementById("queryEventos").value;
        cargando = true;

        if (busqueda == "") { //si no hay nada escrito se cargan los eventos por defecto
            console.log("busqueda vacia");
            if(buscado != null){
                console.log("busqueda vacia2");
                fechaInicio = new Date().toISOString();
                buscado = null;
                vaciarContenedorEventos();
                offset = 0;

                cargarEventos().then(() => {
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
            fechaAnterior = new Date(0);
            buscado = busqueda;
            vaciarContenedorEventos();

            cargarEventos().then(() => {
                cargando = false;
            }).catch((error) => {
                cargando = false;
                console.log(error);
            });
        }
    }
});

function vaciarContenedorEventos(){
    contenedor = document.getElementById("contendorEventos");

    while (contenedor.firstChild.id != "verMasEventos") {
        contenedor.removeChild(contenedor.firstChild);
    }
}

// FUNCIONES PARA EL BOTON VER MAS 
botonVerMas.addEventListener("click", function() {
    if(!cargando){
        cargando = true;
        cargarEventos().then(() => {
            cargando = false;
        }).catch((error) => {
            cargando = false;
            console.log(error);
        });
    }
});

async function cargarEventos(){ //la funcion se ejecuta de manera asincrona
    botonVerMas.disabled = true; 

    try{
        var response;

        if(buscado == null)
            response = await go(appRoot + 'seccion/cargarMas' + '?seccionId=' + seccionId + '&fechaInicio=' + fechaInicio + '&offset=' + offset, 'GET');
        else 
            response = await go(appRoot + 'seccion/buscar' + '?seccionId=' + seccionId + '&fechaInicio=' + fechaInicio +'&busqueda=' + buscado + '&offset=' + offset, 'GET');

        response.eventos.forEach(evento => {
            let fechaActual = new Date(evento.fechaCierre);
            if (fechaAnterior.getFullYear() != fechaActual.getFullYear() ||
                fechaAnterior.getMonth() != fechaActual.getMonth() ||
                fechaAnterior.getDate() != fechaActual.getDate()) {
                    let dia = fechaActual.getDate(); 
                    let mes = fechaActual.getMonth() + 1; // Mes (añadimos 1 para corregir el índice)
                    let año = fechaActual.getFullYear();  

                    introducirSeparadorTemporal(`${dia}/${mes}/${año}`);
                }
            fechaAnterior = fechaActual;
            introducirEvento(evento);
        });

        actualizarTiempoRestante();

        if(response.hayMasEventos){
            botonVerMas.disabled = false;
            botonVerMas.style.display = "block";
        }
        else{
            botonVerMas.style.display = "none";
        }

        offset += 10;
        console.log(response)
    } catch(error){
        console.error('Error:', error);
    }
}

function introducirSeparadorTemporal(stringFecha){
    let contenedor = document.getElementById("contendorEventos");
    let botonVerMas = document.getElementById("verMasEventos");

    let separador = document.createElement("div");
    separador.className = "d-flex align-items-center my-3 w-100";
    separador.innerHTML = `<div class="flex-grow-1 border-bottom"></div>
                            <span class="mx-2 text-muted" style="font-size: 13px;" >` + stringFecha +`</span>
                            <div class="flex-grow-1 border-bottom"></div>`;

    contenedor.insertBefore(separador, botonVerMas);
}

function introducirEvento(evento){
    let contenedor = document.getElementById("contendorEventos");
    let botonVerMas = document.getElementById("verMasEventos");

    let eventoMovil = document.createElement("a");
    eventoMovil.href = appRoot + "evento/" + evento.id+"/apostar";
    eventoMovil.className = "nav-link estilo-contenedor-adaptable w-100 px-2 py-2 d-flex d-sm-none";
    eventoMovil.style = "margin: 15px 0px; min-height: 98px; max-height: 98px;";
    eventoMovil.id = "contenedorEvento-"+evento.id;
    eventoMovil.setAttribute("data-fecha-evento",evento.fechaCierre);
    eventoMovil.setAttribute("name","apostar");
    
    let html = `<img width="40" height="40" class="my-auto ms-1 flex-shrink-0" src="`+appRoot +'seccion/'+evento.id+'/pic'+`">
                        <div class="d-flex flex-column ms-2 flex-grow-1" style="min-width: 0;">
                            <div class="d-flex w-100">
                                <div class="d-flex flex-column flex-grow-1 me-3" style="min-width: 0;">
                                    <p class="ms-2 mb-0 textoColapsable" style = "font-size: 16px;" >`+evento.nombre+`</p>
                                    <p class="ms-2 mb-0 tiempo-restante" style="font-size: 12px; text-align: left;">
                                        <span >Quedan:</span> 
                                        <span class="tiempo-restante" tdata-fecha-evento="`+evento.fechaCierre+`">Fecha evento</span>
                                    </p>
                                </div>

                                <button class ="btn boton-dinamico ms-auto p-1 d-flex align-items-start flex-shrink-0" style="align-self: flex-start;box-sizing: border-box;" title="Unirse a chat" data-url="`+appRoot+'/chat/'+evento.id+`" onclick="event.preventDefault();window.location.href=this.dataset.url">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-fill" viewBox="0 0 16 16">
                                        <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15"/>
                                    </svg>
                                </button>
                            </div>

                            <div class="ms-2 caja-etiquetas scrollBarPerso">`;

    evento.etiquetas.forEach(etiqueta => {
        html += '<span class="etiquetaEvento text-nowrap">'+etiqueta+'</span>\n';
    });
    html += `</div></div>`;

    eventoMovil.innerHTML = html;

    let eventoOrdenador = document.createElement("a");
    eventoOrdenador.href = appRoot + "evento/" + evento.id+"/apostar";
    eventoOrdenador.className = "nav-link d-none d-sm-inline-flex flex-column estilo-contenedor-adaptable px-3 py-2 align-items-start Evento ";
    eventoOrdenador.setAttribute("name","apostar");
    eventoOrdenador.id = "contenedorEvento-"+evento.id;
    eventoOrdenador.setAttribute("data-fecha-evento",evento.fechaCierre);

    htmlOrdenador = `<div class="d-flex align-items-start w-100">
                            <div class = "d-flex d-inline-flex align-items-end flex-grow-1 me-2" style="min-width: 0;">
                                <img width="25" height="25" src="`+appRoot +'seccion/'+evento.id+`/pic">
                                <p class="ms-2 mb-0 textoColapsable">`+evento.nombre+`</p>
                            </div>

                            <div class="vr ms-auto flex-shrink-0" style = "width: 2px;"></div>
                            <div class="ms-2 d-flex flex-column align-items-center flex-shrink-0">
                                <p class="mb-0" style ="font-size: 12px;text-align: center;">Quedan</p>
                                <p class="mb-0 tiempo-restante" style = "font-size: 12px; text-align: center;"  data-fecha-evento="`+evento.fechaCierre+`"></p>
                            </div>

                            <button class ="btn boton-dinamico p-1 d-flex align-items-start ms-3 flex-shrink-0" title="Unirse a chat"data-url="`+appRoot+'/chat/'+evento.id+`" onclick="event.preventDefault();window.location.href=this.dataset.url">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-fill" viewBox="0 0 16 16">
                                    <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15"/>
                                </svg>
                            </button>
                        </div>
                        <div class="caja-etiquetas scrollBarPerso">`

    evento.etiquetas.forEach(etiqueta => {
        htmlOrdenador += '<span class="etiquetaEvento text-nowrap">'+etiqueta+'</span>\n';
    });
    htmlOrdenador += `</div>`;

    eventoOrdenador.innerHTML = htmlOrdenador;

    contenedor.insertBefore(eventoMovil, botonVerMas);
    contenedor.insertBefore(eventoOrdenador, botonVerMas);
}