const userId = document.getElementById('userId').value; //Id del usuario logueado
let eventoInicial //Chat inicial que se abre al cargar la pagina

if(document.getElementById('eventoInicial')){
    eventoInicial = document.getElementById('eventoInicial').value;
}

let primeraCarga = true;
let cargando = false;
var busqueda = "";
var idUltimoEmisor = -1; //saber quien fue el ultimo en mandar un mensaje
var ultimaFecha = new Date(0); //saber la fecha del ultimo mensaje
var ultimoContenedorMensaje = null; //saber el contenedor del ultimo mensaje
var idEventoSeleccionado = -1;
var contenedorEventoSeleccionado = null; //Contenedor del evento seleccionado (para eliminar el estilo de seleccionado)

let idMensajeClicado = 0; //para el menu contextual

function inicializarMenusContextuales(){
    const botonEliminarMensaje = document.getElementById("botonEliminarMensaje");
    const formReporte = document.getElementById("formReporte");

    if(botonEliminarMensaje){
        botonEliminarMensaje.addEventListener("click", function () {
            go(config.rootUrl + '/chats/borrarMensaje/' + idMensajeClicado, 'DELETE').then(function (data) {
            }).catch(function (error) {
                console.log(error);
            });
        });
    }

    document.addEventListener("click", function () {
        let menuPropio = document.getElementById("menuPropio");
        let menuAgeno = document.getElementById("menuAgeno");

        menuPropio.classList.add("desaparece");
        menuAgeno.classList.add("desaparece");
    });

    document.addEventListener("wheel", () => {
        let menuPropio = document.getElementById("menuPropio");
        let menuAgeno = document.getElementById("menuAgeno");

        menuPropio.classList.add("desaparece");
        menuAgeno.classList.add("desaparece");
    });

    if(formReporte){
        formReporte.addEventListener("submit", function (e) {
            e.preventDefault();
            const motivo = document.getElementById("motivo").value.trim();

            if (!motivo) {
                document.getElementById("motivo").classList.add("is-invalid");
                return;
            }

            go(config.rootUrl + '/chats/reportarMensaje/' + idMensajeClicado, 'POST', { motivo: motivo }).then(function (data) { }).catch(function (error) { console.log(error); });

            const modal = bootstrap.Modal.getInstance(document.getElementById("reportarModal"));
            modal.hide();

            this.reset();
            document.getElementById("motivo").classList.remove("is-invalid");
        });
    }
}

function inicializarLupaEventos(){
    const buscador = document.getElementById('queryEventos');

    if (buscador) {
        buscador.addEventListener('keypress', function (event) {
            if (event.key === "Enter") {
                busqueda = document.getElementById("queryEventos").value;
                buscarChat(busqueda);
            }
        });
    }
}

function inicializaEnvioMensajes(){
    const inputMensaje = document.getElementById('campoMensaje');
    const botonEnviar = document.getElementById('botonEnviar');

    if (inputMensaje) {
        inputMensaje.addEventListener('keypress', function (event) {
            if (event.key === "Enter") {
                enviarMensaje();
            }
        });
    }

    if (botonEnviar) {
        botonEnviar.addEventListener('click', function () {
            enviarMensaje();
        });
    }
}

function inicializaBotonRetroceder(){
    const botonRetroceder = document.getElementById('botonRetroceder');

    if (botonRetroceder) {
        botonRetroceder.addEventListener('click', function () {
            idEventoSeleccionado = -1;
            if (contenedorEventoSeleccionado) contenedorEventoSeleccionado.classList.remove("resaltaHoverSelected");
            contenedorEventoSeleccionado = null;

            document.getElementById("chatContainer").classList.remove('paginaChatsActiva'); //foco en el input de mensaje
            document.getElementById("contenedorMenuListaChats").classList.add('paginaChatsActiva'); //foco en el input de mensaje
        });
    }
}

//El boton apostar del chat redirige al ID del evento conteniedo en "idEventoSeleccionado"
document.addEventListener('DOMContentLoaded', function () {
    inicializarLupaEventos();
    inicializaEnvioMensajes();
    inicializaBotonRetroceder();
    inicializarMenusContextuales();
});


/*WEB-SOCKETS*/

function suscribirseWebSocketChat(chat) {
    ws.subscribe('/topic/chats/' + chat.idEvento, function (data) {
        console.log(data);
        if (data.tipoEvento == 'nuevoMensaje') {
            if (idEventoSeleccionado != chat.idEvento) {
                //El chat no esta abierto +1 mensaje no leido y se reintroduce ordenado
                let chatDiv = document.querySelector(`[data-idEvento="${chat.idEvento}"]`);
                let mensajesNoLeidos = parseInt(chatDiv.querySelector('.badge').textContent);
                if (chatDiv) { //por si se ha eliminado el chat
                    anadirChat({ idEvento: chat.idEvento, mensajesNoLeidos: mensajesNoLeidos + 1, ultimoMensaje: data.mensaje.contenido, fechaUltimoMensaje: data.mensaje.fecha, nombreEvento: chat.nombreEvento });
                    chatDiv.remove();
                }

            } else {
                //si el chat esta abierto se añade el mensaje al chat
                let chatDiv = document.querySelector(`[data-idEvento="${chat.idEvento}"]`);
                let mensaje = data.mensaje;
                anadirMensajeAbajo(mensaje);
                deslizarHaciaAbajo();

                if (chatDiv) { //por si se ha eliminado el chat
                    anadirChat({ idEvento: chat.idEvento, mensajesNoLeidos: 0, ultimoMensaje: data.mensaje.contenido, fechaUltimoMensaje: data.mensaje.fecha, nombreEvento: chat.nombreEvento });
                    chatDiv.remove();
                    chatDiv = document.querySelector(`[data-idEvento="${chat.idEvento}"]`);

                    //Le añado el aspecto para que siga pareciendo como seleccionado
                    chatDiv.classList.add("resaltaHoverSelected");
                    contenedorEventoSeleccionado = chatDiv;
                }

                //Notifico que he visto el mensaje
                go(config.rootUrl + '/chats/notificar/' + chat.idEvento, 'POST').then(function (data) { }).catch(function (error) { console.log(error); });
            }
        }
        else if (data.tipoEvento == 'eliminarMensaje') {
            eliminarMensaje(data.idMensaje);
        }
        else if (data.tipoEvento == 'cambioCuota') {
            let idFormula = data.idFormula;
            let cuotaFavorable = data.cuotaFavorable;
            let cuotaDesfavorable = data.cuotaDesfavorable;

            let elementoFavorable = document.getElementById("cuota-favorable-" + idFormula);
            let elementoDesfavorable = document.getElementById("cuota-desfavorable-" + idFormula);

            if (elementoFavorable && elementoDesfavorable) {
                elementoFavorable.innerHTML = "x" + parseFloat(cuotaFavorable).toFixed(2);
                elementoDesfavorable.innerHTML = "x" + parseFloat(cuotaDesfavorable).toFixed(2);
            }
        }
    });
}

function eliminarMensaje(idMensaje) {
    let mensajeDiv = document.querySelector(`[data-idMensaje="${idMensaje}"]`);
    if (!mensajeDiv) return; //si no existe el mensaje no se hace nada
    let padreDiv = mensajeDiv.parentNode;

    if (padreDiv.childElementCount == 1) {
        let abueloDiv = padreDiv.parentNode;
        let etiquetaArriba = false;
        let etiquetaAbajo = false;
        let elementos = Array.from(abueloDiv.parentNode.children); //obtenemos los hijos del padre (los mensajes)
        let posicion = elementos.indexOf(abueloDiv);

        //si es el unico mensaje del dia se elimina el separador
        if ((elementos[0] !== abueloDiv && elementos[posicion - 1].classList.contains("separadorMensajes")) && (elementos[elementos.length - 1] === abueloDiv || elementos[posicion + 1].classList.contains("separadorMensajes"))) {
            elementos[posicion - 1].remove(); //eliminamos el separador de arriba

            //hay que cambiar el ultimo contenedor (el siguiente mensaje tendrá que introducir uno nuevo)
            if (elementos.length - 1 === posicion) {
                ultimaFecha = new Date(0);
                ultimoContenedorMensaje = null;
                idUltimoEmisor = -1;
            }
        }
        else if (elementos.length - 1 === posicion) {
            ultimoContenedorMensaje = elementos[posicion - 1];
            idUltimoEmisor = ultimoContenedorMensaje.getAttribute('data-idUsuario');
        }

        abueloDiv.remove(); //eliminamos el mensaje
    }
    else {
        let hijosDirectos = Array.from(padreDiv.children);
        if (hijosDirectos.indexOf(mensajeDiv) === 0) {
            //si es el primer hijo del padre (el mensaje) se elimina el separador de arriba
            hijosDirectos[1].setAttribute('atop', '');
            if (mensajeDiv.hasAttribute('pleft'))
                hijosDirectos[1].setAttribute('pleft', '');
            if (mensajeDiv.hasAttribute('pright'))
                hijosDirectos[1].setAttribute('pright', '');
        }

        mensajeDiv.remove(); //Elimino el mensaje del chat
    }
}

//Enviar mensaje
function enviarMensaje() {
    const inputMensaje = document.getElementById('campoMensaje');
    const mensaje = inputMensaje.value.trim();

    if (mensaje.length > 0) {
        inputMensaje.value = '';
        go(config.rootUrl + '/chats/mandarMensaje/' + idEventoSeleccionado, 'POST', { contenido: mensaje }).then(function (data) {
            inputMensaje.value = '';
        }).catch(function (error) {
            console.log(error);
        });
    }
}

//Al cargar la pagina se pide al servidor una lista de los chats a los que esta suscrito el usuario
//Esto permite no repetir codigo en html del servidor ya que las funciones de insertar chat/mensaje se van a tener
//que usar en el js obligatoriamente al llegar un mensaje nuevo (un chat que esta abajo en la lista se elimina y añade arriba)
function cargarChats() {
    go(config.rootUrl + '/chats/cargarChats', 'GET').then(function (data) {
        let listaChats = data.chats;
        console.log(listaChats);

        listaChats.forEach(chat => {
            anadirChat(chat);
            suscribirseWebSocketChat(chat);
        });

        if (primeraCarga) {
            if (eventoInicial != -1) {
                let chatDiv = document.querySelector(`[data-idEvento="${eventoInicial}"]`);
                if (chatDiv) {
                    chatDiv.click(); //simulo el click para abrir el chat
                }
            }
        }
        cargandoFormulas = false;
    }).catch(function (error) {
        cargandoFormulas = false;
    });
}

//Rellena la zona de mensajes con los mensajes del chat relacionado al evento "idEvento"
function cargarMensajes(idEvento) {
    go(config.rootUrl + '/chats/cargarMensajes/' + idEvento, 'GET').then(function (data) {
        data.mensajes.forEach(mensaje => {
            anadirMensajeAbajo(mensaje);
        });

        deslizarHaciaAbajo();
        cargandoFormulas = false; //ya no estoy cargando mensajes
    }).catch(function (error) {
        console.log(error);
        cargandoFormulas = false; //ya no estoy cargando mensajes
    });
}

//Precondicion: el usuario ya tiene que pertenecer al chat
//Al puslar un chat se eliminan los mensajes del chat anterior, cambia la imagen del chat, el nombre y cambia la variable idEventoSeleccionado
//idEventoSeleccionado permite que al pulsar el boton de apostar sepa a que evento redirigir sin tener que cambiar la funcion onClick cada vez
function seleccionarChat(chat, componente) {
    const chatContainer = document.getElementById("chatContainer");
    const imagenCabeceraChat = document.getElementById("imagenCabeceraChat");
    const tituloCabeceraChat = document.getElementById("tituloCabeceraChat");
    const tituloCabeceraChatMobile = document.getElementById("tituloCabeceraChatMobile");
    console.log("no me hace caso");
    console.log(chat);

    //Cambio la barra de cabecera de chat
    chatContainer.classList.add("d-lg-flex", "flex-column");

    imagenCabeceraChat.setAttribute("src", config.rootUrl + "/seccion/" + chat.idEvento + "/pic");
    tituloCabeceraChat.textContent = chat.nombreEvento;
    tituloCabeceraChatMobile.textContent = chat.nombreEvento;

    //Reinicio la zona de mensajes
    eliminarMensajes();
    idUltimoEmisor = -1;
    ultimaFecha = new Date(0);
    ultimoContenedorMensaje = null;

    //Elimino el numero de mensajes no leidos del chat (como acabo de entrar ya se han leido)
    if(componente){
        const indicadorMensajes = componente.querySelector('.badge');
        indicadorMensajes.classList.add('d-none');
        indicadorMensajes.textContent = 0;
    }

    idEventoSeleccionado = chat.idEvento;

    //Reinicio zona de formulas
    fechaInicio = new Date().toISOString();
    buscado = null;
    vaciarContenedorFormulas();
    offset = 0;
    document.getElementById("queryApuestas").value = "";
    cargandoFormulas = true;
    cargarVariables();
    cargarFormulas().then(() => {
        cargandoFormulas = false;
    }).catch((error) => {
        cargandoFormulas = false;
        console.log(error);
    });
}

//chat: {idEvento, mensajesNoLeidos, ultimoMensaje, fechaUltimoMensaje, nombreEvento}
//Añado un chat a la lista de chats, ordenandolo por fecha de ultimo mensaje
function anadirChat(chat) {
    let textoNumMensajes = chat.mensajesNoLeidos >= 100 ? '99+' : chat.mensajesNoLeidos; //si hay muchos mensajes se pone 99+
    let chatDiv = document.createElement('div');
    chatDiv.setAttribute('data-fecha', chat.fechaUltimoMensaje); //guardamos la fecha en el HTML para ordenar previamente sin variables extras en el JS
    chatDiv.setAttribute('data-idEvento', chat.idEvento); //No se usa pero por si acaso hace falta en el futuro
    chatDiv.setAttribute('data-nombreEvento', chat.nombreEvento); //Guardamos el nombre para que en la lupa podamos saber si conicide con la busqueda
    chatDiv.setAttribute('role', 'button');
    chatDiv.setAttribute('class', 'd-flex w-100 mt-2 p-2 resaltaHover');
    chatDiv.setAttribute('style', 'border-radius: 15px;');
    chatDiv.innerHTML = `<img class="flex-shrink-0" width="55" height="55" src="${config.rootUrl}/seccion/${chat.idEvento}/pic" style="border-radius: 50%;">
                        <div class="d-flex flex-column h-100 justify-content-center ms-2 flex-grow-1" style="width: calc(100% - 71px);">
                            <div class="d-flex flex-row justify-content-between">
                                <h5 class="m-0 text-nowrap text-truncate">${chat.nombreEvento}</h5>
                                <span class="ms-auto mb-auto px-1" style="font-size: 14px;"> ${formatearFechaMensaje(chat.fechaUltimoMensaje)}</span>
                            </div>
                            
                            <div class="d-flex flex-row justify-content-between">
                                <p class="m-0 mt-1 text-nowrap text-truncate" style="font-size: 14px;">${chat.ultimoMensaje}</p>
                                <span class="indicadorMensajes ms-2 badge bg-primary ${chat.mensajesNoLeidos == 0 ? 'd-none' : ''}" style="font-size: 12px;border-radius: 25px;">${textoNumMensajes}</span>
                            </div>
                        </div>`;

    chatDiv.addEventListener('click', function () {
        document.getElementById("chatContainer").classList.add('paginaChatsActiva'); //foco en el input de mensaje
        document.getElementById("contenedorMenuListaChats").classList.remove('paginaChatsActiva'); //foco en el input de mensaje

        if (cargandoFormulas || idEventoSeleccionado === chat.idEvento) return;
        cargandoFormulas = true;

        if (contenedorEventoSeleccionado) contenedorEventoSeleccionado.classList.remove("resaltaHoverSelected");
        chatDiv.classList.add("resaltaHoverSelected");
        contenedorEventoSeleccionado = chatDiv;

        seleccionarChat(chat, chatDiv);
        cargarMensajes(chat.idEvento);
    });

    //si ya hay una busqueda hecha cuando se añade se verifica si tiene que ser visible o no
    if (busqueda != "" && !chat.nombreEvento.toLowerCase().includes(busqueda.toLowerCase())) {
        componente.classList.remove('d-none');
        componente.classList.add('d-flex');
    }


    insertarChatOrdenado(chatDiv);

    return chatDiv; //devuelvo el div creado por si quiero hacer algo con el 
}

//Hace invisibles todos los chats que no contengan la busqueda en su nombre (data-nombreEvento)
//Por otro lado hace visibles los que contengan la busqueda por si se han hecho invisibles previamente
//(no se llegan a eliminar del HTML solo se ocultan)
function buscarChat(busqueda) {
    const contenedor = document.getElementById('contenedorChats');
    const hijos = Array.from(contenedor.children);
    busqueda = busqueda.toLowerCase(); //normalizo la busqueda a minusculas

    if (busqueda === "") {
        //si la lupa esta vacia se muestran todos los chats
        hijos.forEach(componente => {
            componente.classList.remove('d-none');
            componente.classList.add('d-flex');
        });
    }
    else {
        hijos.forEach(componente => {
            const nombreEvento = componente.getAttribute('data-nombreEvento').toLowerCase(); //normalizo el nombre del evento a minusculas
            if (!nombreEvento) return; //si no hay nombre no se hace nada

            if (nombreEvento.includes(busqueda)) {
                componente.classList.remove('d-none');
                componente.classList.add('d-flex');
            } else {
                componente.classList.remove('d-flex');
                componente.classList.add('d-none');
            }
        });
    }
}

//mensaje: {id, idEmisor, emisor, contenido, fecha}
//Añado un mensaje al chat abierto, si es del mismo emisor que el anterior lo agrupo sino creo un nuevo grupo
function anadirMensajeAbajo(mensaje) {
    const propio = mensaje.idEmisor == userId; //si el mensaje es del usuario logueado
    var nuevoMensajeDiv = document.createElement('div');
    nuevoMensajeDiv.setAttribute('class', 'mensaje mt-1 pb-1 pt-2 text-wrap text-break');
    nuevoMensajeDiv.setAttribute('data-idMensaje', mensaje.id); //guardo el id del mensaje para poder eliminarlo si es necesario

    if (propio) nuevoMensajeDiv.classList.add('ms-auto');
    else nuevoMensajeDiv.classList.add('me-auto');

    nuevoMensajeDiv.setAttribute('speech-bubble', '');

    if (normalizarFecha(ultimaFecha) < normalizarFecha(new Date(mensaje.fecha))) {
        ultimaFecha = new Date(mensaje.fecha);
        insertarSeparador(formatearFechaSeparador(mensaje.fecha));
        idUltimoEmisor = -1;
    }

    if (mensaje.idEmisor != idUltimoEmisor) {
        insertarGrupoMensajes(mensaje.idEmisor, propio);
        idUltimoEmisor = mensaje.idEmisor;

        nuevoMensajeDiv.setAttribute('style', 'max-width: 650px; min-width: 250px;');

        if (propio) nuevoMensajeDiv.setAttribute('pright', '');
        else nuevoMensajeDiv.setAttribute('pleft', '');

        nuevoMensajeDiv.setAttribute('atop', '');

        nuevoMensajeDiv.innerHTML = "";

        if (!propio)
            nuevoMensajeDiv.innerHTML = `<div class="fw-bold text-success mb-1">${mensaje.emisor}</div>`;

        nuevoMensajeDiv.innerHTML += `<p class="mb-1">${mensaje.contenido}</p>
                                    <div class="text-end">
                                        <span class="text-secondary small">${obtenerHora(mensaje.fecha)}</span>
                                    </div>`;
    }
    else {
        nuevoMensajeDiv.setAttribute('style', 'max-width: 650px;min-width: 250px;');

        if (!propio) nuevoMensajeDiv.setAttribute("style", nuevoMensajeDiv.getAttribute("style") + "margin-left: 24px;");
        else nuevoMensajeDiv.setAttribute("style", nuevoMensajeDiv.getAttribute("style") + "margin-right: 24px;");

        nuevoMensajeDiv.innerHTML = `<p class="mb-1">${mensaje.contenido}</p>
                                    <div class="text-end">
                                        <span class="text-secondary small">${obtenerHora(mensaje.fecha)}</span>
                                    </div>`;
    }

    if (propio) {
        const menu = document.getElementById("menuPropio");
        const menuAgeno = document.getElementById("menuAgeno");

        nuevoMensajeDiv.addEventListener("contextmenu", function (e) {
            e.preventDefault();

            idMensajeClicado = mensaje.id;
            menu.style.left = `${e.pageX}px`;
            menu.style.top = `${e.pageY}px`;
            menu.classList.remove("desaparece");
            menuAgeno.classList.add("desaparece");
        });
    }
    else {
        const menu = document.getElementById("menuAgeno");
        const menuPropio = document.getElementById("menuPropio");

        nuevoMensajeDiv.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            idMensajeClicado = mensaje.id;

            menu.style.left = `${e.pageX}px`;
            menu.style.top = `${e.pageY}px`;
            menu.classList.remove("desaparece");
            menuPropio.classList.add("desaparece");
        });
    }

    ultimoContenedorMensaje.appendChild(nuevoMensajeDiv);
}

//Obtengo la fecha en formato para mostrar a la derecha del evento
function formatearFechaMensaje(fecha) {
    var fecha = new Date(fecha);
    var hoy = new Date();
    if (fecha.getDate() == hoy.getDate() && fecha.getMonth() == hoy.getMonth() && fecha.getFullYear() == hoy.getFullYear()) {
        return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        return fecha.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
}

function formatearFechaSeparador(input) {
    let fecha = new Date(input);
    return fecha.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
}

//Obtengo solo la hora para mostrarlo en el mensaje
function obtenerHora(fecha) {
    var fecha = new Date(fecha);
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

//Añado en la parte de abajo del chat un separador con la fecha de los mensajes de abajo
function insertarSeparador(texto) {
    const contenedorMensajes = document.getElementById("contenedorMensajes");

    var nuevoSeparador = document.createElement('div');
    nuevoSeparador.setAttribute('style', 'border-radius: 10px;');
    nuevoSeparador.setAttribute('class', 'py-2 px-3 my-2 text-center flex-shrink-0 ms-auto me-auto separadorMensajes');
    nuevoSeparador.innerHTML = `<span>${texto}</span>`;

    contenedorMensajes.appendChild(nuevoSeparador);
}

//Inserto un grupo de mensajes de un mismo emisor. (imagenPerfil + nombre + mensaje con estilo de bocadillo)
function insertarGrupoMensajes(idUsuario, propio) {
    const contenedorMensajes = document.getElementById("contenedorMensajes");
    var contenedorGlobal = document.createElement('div');
    contenedorGlobal.setAttribute('class', 'd-flex flex-row mt-2');
    contenedorGlobal.setAttribute('data-idUsuario', idUsuario);

    contenedorGlobal.innerHTML = `<a style="max-width:40px; max-height:40px;" href="${config.rootUrl}/user/${idUsuario}"><img class="flex-shrink-0" width="40" height="40" src="/user/${idUsuario}/pic" style="border-radius: 50%;"></a>`;

    ultimoContenedorMensaje = document.createElement('div');
    if (propio) ultimoContenedorMensaje.setAttribute('class', 'd-flex flex-column mx-2 ms-auto');
    else ultimoContenedorMensaje.setAttribute('class', 'd-flex flex-column mx-2');


    if (propio) contenedorGlobal.prepend(ultimoContenedorMensaje);
    else contenedorGlobal.appendChild(ultimoContenedorMensaje);

    contenedorMensajes.appendChild(contenedorGlobal);
}

//Permite introducir el componente ya creado de evento de manera ordenada (se usa en anadirChat)
function insertarChatOrdenado(nuevoChatDiv) {
    const contenedor = document.getElementById('contenedorChats');
    const hijos = Array.from(contenedor.children);

    // Ignora el input buscador
    const nuevaFecha = new Date(nuevoChatDiv.getAttribute('data-fecha'));

    let insertado = false;
    for (let i = 0; i < hijos.length; i++) {
        const actual = hijos[i];

        const fechaActual = new Date(actual.getAttribute('data-fecha'));
        if (nuevaFecha > fechaActual) {
            contenedor.insertBefore(nuevoChatDiv, actual);
            insertado = true;
            break;
        }
    }

    if (!insertado) {
        contenedor.appendChild(nuevoChatDiv); // si no se insertó, lo ponemos al final
    }
}

//Elimina todos los mensajes del chat (para cargar un nuevo chat normalmente)
function eliminarMensajes() {
    const contenedorMensajes = document.getElementById("contenedorMensajes");

    while (contenedorMensajes.firstChild) {
        contenedorMensajes.removeChild(contenedorMensajes.firstChild);
    }

    idUltimoEmisor = -1;
    ultimaFecha = new Date(0);
    ultimoContenedorMensaje = null;
}

//Permite crear una nueva fecha ignorando la hora y los minutos 
//(para saber si entre un mensaje y otro ha cambiado el dia y poner un separador)
function normalizarFecha(fecha) {
    return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

function deslizarHaciaAbajo() {
    let contenedor = document.getElementById("contenedorMensajes")
    contenedor.scrollTo({
        top: contenedor.scrollHeight,
        behavior: 'smooth'
    });
}

/*Funciones para el modal*/

const botonVerMas = document.getElementById("verMasEventos");
var offset = 0; // numElementos cargados
var buscado = null; // indica la ultima busqueda realizada (para sobre la busqueda ver mas)
let fechaInicio = new Date().toISOString(); // fecha en que se trajeron eventos por primera vez (para evitar que las cosas se descuadren)
var cargandoFormulas = true;

cargarFormulas().then(() => {
    cargandoFormulas = false;
});

botonVerMas.addEventListener("click", function () {
    if (!cargandoFormulas) {
        cargandoFormulas = true;
        cargarFormulas().then(() => {
            cargandoFormulas = false;
        }).catch((error) => {
            cargandoFormulas = false;
            console.log(error);
        });
    }
});

/* FUNCION PARA LA LUPA */
document.getElementById("queryApuestas").addEventListener("keypress", function (event) {
    if (event.key === "Enter" && !cargandoFormulas) {
        cargandoFormulas = true;
        var busqueda = document.getElementById("queryApuestas").value;

        if (busqueda == "") { //si no hay nada escrito se cargan los eventos por defecto
            if (buscado != null) {
                fechaInicio = new Date().toISOString();
                buscado = null;
                vaciarContenedorFormulas();
                offset = 0;

                cargarFormulas().then(() => {
                    cargandoFormulas = false;
                }).catch((error) => {
                    cargandoFormulas = false;
                    console.log(error);
                });
            }
            else {
                cargandoFormulas = false;
            }
        }
        else if (buscado != busqueda) {
            offset = 0;
            fechaInicio = new Date().toISOString();
            buscado = busqueda;
            vaciarContenedorFormulas();

            cargarFormulas().then(() => {
                cargandoFormulas = false;
            }).catch((error) => {
                cargandoFormulas = false;
                console.log(error);
            });
        }
    }
});

function vaciarContenedorFormulas() {
    contenedor = document.getElementById("contendorFormulas");

    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
}

async function cargarFormulas() {
    if (idEventoSeleccionado == -1) return; //no hay evento seleccionado
    botonVerMas.disabled = true;

    try {
        var response;

        if (buscado == null)
            response = await go(config.rootUrl + "/evento/" + idEventoSeleccionado + "/apostar/cargarMas" + '?fechaInicio=' + fechaInicio + '&offset=' + offset, 'GET');
        else
            response = await go(config.rootUrl + "/evento/" + idEventoSeleccionado + "/apostar/buscar" + '?fechaInicio=' + fechaInicio + '&busqueda=' + buscado + '&offset=' + offset, 'GET');

        response.formulas.forEach(formula => {
            anadirFormula(formula);
        });

        if (response.hayMasFormulas) {
            botonVerMas.disabled = false;
            botonVerMas.style.display = "block";
        }
        else {
            botonVerMas.style.display = "none";
        }

        offset += response.formulas.length;
        console.log(response)
    } catch (error) {
        console.error('Error:', error);
    }
}

function anadirFormula(formula) {
    let elementoHTML = document.createElement("div");
    elementoHTML.className = "d-flex flex-column contenedor-apuesta";
    elementoHTML.style = "position: relative;";
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
        </div>
        
        <div id="cuestionario-form-${formula.id}" class="w-100 d-flex align-items-center mt-3">
            <button type="button" class="btn btn-success botonApostarFavorable d-flex flex-column g-0" onclick="enviarFormulario(true,${formula.id})">
                <span style="font-size:14px;" id="cuota-favorable-${formula.id}">x${parseFloat(formula.cuotaFaborable).toFixed(2)}</span>
                <span style="font-size:12px;">(favorable)</span>
            </button>

            <input type="number" id="cantidad-${formula.id}" class ="form-control mx-2 flex-grow-1" placeholder="cantidad..." required>

            <button type="button" class="btn btn-success botonApostarDesfavorable d-flex flex-column g-0" style="gap: 0px;" onclick="enviarFormulario(false,${formula.id})">
                <span style="font-size:14px;" id="cuota-desfavorable-${formula.id}">x${parseFloat(formula.cuotaDesfavorable).toFixed(2)}</span>
                <span style="font-size:12px;">(desfavorable)</span>
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
document.getElementById("boton-crear-formula-reducido").addEventListener("click", () => {
    mostrarModal();
});

function mostrarModal() {
    console.log("entra");
    var elementos1 = document.querySelectorAll('.vision-creatuApuesta-1');
    var elementos2 = document.querySelectorAll('.vision-creatuApuesta-2');

    elementos1.forEach(function (elemento) {
        elemento.classList.remove('desaparece');
    });

    elementos2.forEach(function (elemento) {
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

    if (titulo.checkValidity() && formula.checkValidity()) {
        elementos1.forEach(function (elemento) {
            elemento.classList.add('desaparece');
        });

        elementos2.forEach(function (elemento) {
            elemento.classList.remove('desaparece');
        });

        document.getElementById("botonRetrocederCrearApuesta").classList.remove('invisible');
    }

});

document.getElementById("botonRetrocederCrearApuesta").addEventListener("click", () => {
    var elementos1 = document.querySelectorAll('.vision-creatuApuesta-1');
    var elementos2 = document.querySelectorAll('.vision-creatuApuesta-2');

    elementos1.forEach(function (elemento) {
        elemento.classList.remove('desaparece');
    });

    elementos2.forEach(function (elemento) {
        elemento.classList.add('desaparece');
    });

    document.getElementById("botonRetrocederCrearApuesta").classList.add('invisible');
});

document.getElementById("crearApuestaForm").addEventListener("submit", function (event) {
    event.preventDefault();
    if (!enviandoFormulario) {
        enviandoFormulario = true;
        const titulo = document.getElementById("tituloModal").value;
        const formula = document.getElementById("formulaModal").value;
        var cantidad = parseFloat(document.getElementById("cantidadModal").value);
        cantidad = Math.floor(cantidad * 100);
        const tipoApuesta = document.getElementById("tipoApuestaModal").value == "favorable";

        go(config.rootUrl + "/evento/"+idEventoSeleccionado+"/crearFormula", 'POST', { titulo, formula, cantidad, tipoApuesta }).then((response) => {
            if (response.status == "OK") {
                document.getElementById("ocultador-formulario2").classList.add("invisible");
                let check = document.getElementById("confirmacionApuesta2");
                check.classList.remove("invisible");
                check.style.animation = "fadeIn 0.5s ease-in-out";

                setTimeout(() => {
                    check.classList.add("invisible");
                    document.getElementById("ocultador-formulario2").classList.remove("invisible");
                    const modalEl = document.getElementById('modalCrearApuesta');
                    const modalInstance = bootstrap.Modal.getInstance(modalEl);
                    modalInstance.hide();
                    anadirFormula(response.formula);
                    enviandoFormulario = false;
                }, 1000);
            }
            else {
                if (response.status == "ERROR-TITULO") {
                    document.getElementById("tituloModal").classList.add("border", "border-danger");
                    mostrarModal();
                }
                else if (response.status == "ERROR-FORMULA") {
                    document.getElementById("formulaModal").classList.add("border", "border-danger");
                    mostrarModal();
                }
                else if (response.status == "ERROR-CANTIDAD")
                    document.getElementById("cantidadModal").classList.add("border", "border-danger");
                else if (response.status == "ERROR-TIPO")
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

function enviarFormulario(esFavorable, id) {
    var input = document.getElementById("cantidad-" + id);

    if (!enviandoFormulario && input.value != "") {
        enviandoFormulario = true;
        var cantidad = parseFloat(input.value);
        cantidad = Math.floor(cantidad * 100); // Convertir a centimos
        const idFormula = id;
        const decision = esFavorable;

        console.log({ idFormula, decision, cantidad });

        goTexto(config.rootUrl + '/evento/apostar', 'POST', { idFormula, decision, cantidad }).then((response) => {
            enviandoFormulario = false;
            if (response == "OK") {
                const contenedorFormula = document.getElementById("formula-" + id);

                //Todos los hijos invisibles
                for (let child of contenedorFormula.children) {
                    child.classList.add("invisible");
                }

                let check = document.getElementById("confirmacionApuesta-" + id);
                check.classList.remove("invisible");
                check.style.animation = "fadeIn 0.5s ease-in-out";

                setTimeout(() => {
                    for (let child of contenedorFormula.children) {
                        child.classList.remove("invisible");
                    }
                    check.classList.add("invisible");
                    input.value = "";
                }, 1500);
            }
            else {
                console.log(response);
                input.classList.add("border", "border-danger");
            }
        }).catch((error) => {
            console.log(error);
            enviandoFormulario = false;
        });
    }
}

function cargarVariables() {
    go(config.rootUrl + '/evento/' + idEventoSeleccionado + '/getVariables', 'GET').then(function (data) { 
        const contenedor = document.getElementById("lista-Variables-texto");
        contenedor.textContent = data.variables.join(", ");
    }).catch(function (error) { 
        console.log(error); 
    });
}

function suscribirse(id){
    go(config.rootUrl + '/chats/' + id+'/suscribirse' ,'POST').then(function (data) {
        const botonSuscribirse = document.getElementById("btn_suscribirse");
        const botonDesuscribirse = document.getElementById("btn_desuscribirse");

        botonSuscribirse.classList.add("desaparece");
        botonDesuscribirse.classList.remove("desaparece");
    }).catch(function (error) {console.log(error);});
}

function desuscribirse(id){
    go(config.rootUrl + '/chats/' + id+'/desuscribirse' ,'POST').then(function (data) {
        const botonSuscribirse = document.getElementById("btn_suscribirse");
        const botonDesuscribirse = document.getElementById("btn_desuscribirse");

        botonSuscribirse.classList.remove("desaparece");
        botonDesuscribirse.classList.add("desaparece");
    }).catch(function (error) {console.log(error);});
}