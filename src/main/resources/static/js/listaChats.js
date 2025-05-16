const appRoot = document.getElementById('root').value; //th:href="@{/}"
const userId = document.getElementById('userId').value; //Id del usuario logueado
const eventoInicial = document.getElementById('eventoInicial').value; //Chat inicial que se abre al cargar la pagina

let primeraCarga = true;
let cargando = false;
var busqueda = "";
var idUltimoEmisor = -1; //saber quien fue el ultimo en mandar un mensaje
var ultimaFecha = new Date(0); //saber la fecha del ultimo mensaje
var ultimoContenedorMensaje = null; //saber el contenedor del ultimo mensaje
var idEventoSeleccionado = -1;
var contenedorEventoSeleccionado = null; //Contenedor del evento seleccionado (para eliminar el estilo de seleccionado)

let idMensajeClicado = 0; //para el menu contextual

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("botonEliminarMensaje").addEventListener("click", function () {
        go(config.rootUrl + '/chats/borrarMensaje/' + idMensajeClicado, 'DELETE').then(function (data) {
        }).catch(function (error) {
            console.log(error);
        });
    });

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

    document.getElementById("formReporte").addEventListener("submit", function (e) {
        e.preventDefault();
        const motivo = document.getElementById("motivo").value.trim();

        if (!motivo) {
            document.getElementById("motivo").classList.add("is-invalid");
            return;
        }

        go(config.rootUrl + '/chats/reportarMensaje/' + idMensajeClicado, 'POST', { motivo: motivo }).then(function (data) {}).catch(function (error) {console.log(error);});

        const modal = bootstrap.Modal.getInstance(document.getElementById("reportarModal"));
        modal.hide();

        this.reset();
        document.getElementById("motivo").classList.remove("is-invalid");
    });
});

//El boton apostar del chat redirige al ID del evento conteniedo en "idEventoSeleccionado"
document.addEventListener('DOMContentLoaded', function () {
    const botonApostarCabecera = document.getElementById('botonApostarCabecera');
    const buscador = document.getElementById('queryEventos');
    const inputMensaje = document.getElementById('campoMensaje');
    const botonEnviar = document.getElementById('botonEnviar');
    const botonRetroceder = document.getElementById('botonRetroceder');

    if (botonApostarCabecera) {
        botonApostarCabecera.addEventListener('click', function () {
            window.location.href = `${appRoot}evento/${idEventoSeleccionado}/apostar`;
        });
    }

    if (buscador) {
        buscador.addEventListener('keypress', function (event) {
            if (event.key === "Enter") {
                busqueda = document.getElementById("queryEventos").value;
                buscarChat(busqueda);
            }
        });
    }

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

    if (botonRetroceder) {
        botonRetroceder.addEventListener('click', function () {
            idEventoSeleccionado = -1;
            if (contenedorEventoSeleccionado) contenedorEventoSeleccionado.classList.remove("resaltaHoverSelected");
            contenedorEventoSeleccionado = null;

            document.getElementById("chatContainer").classList.remove('paginaChatsActiva'); //foco en el input de mensaje
            document.getElementById("contenedorMenuListaChats").classList.add('paginaChatsActiva'); //foco en el input de mensaje
        });
    }

    cargarChats();
});


/*WEB-SOCKETS*/

function suscribirseWebSocketChat(chat) {
    ws.subscribe(appRoot + 'topic/chats/' + chat.idEvento, function (data) {
        console.log("llega el mensaje");
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
                go(appRoot + 'chats/notificar/' + chat.idEvento, 'POST').then(function (data) { }).catch(function (error) { console.log(error); });
            }
        }
        else if (data.tipoEvento == 'eliminarMensaje') {
            eliminarMensaje(data.idMensaje);
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
        go(appRoot + 'chats/mandarMensaje/' + idEventoSeleccionado, 'POST', { contenido: mensaje }).then(function (data) {
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
    go(appRoot + 'chats/cargarChats', 'GET').then(function (data) {
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
        cargando = false;
    }).catch(function (error) {
        cargando = false;
    });
}

//Rellena la zona de mensajes con los mensajes del chat relacionado al evento "idEvento"
function cargarMensajes(idEvento) {
    go(appRoot + 'chats/cargarMensajes/' + idEvento, 'GET').then(function (data) {
        data.mensajes.forEach(mensaje => {
            anadirMensajeAbajo(mensaje);
        });

        deslizarHaciaAbajo();
        cargando = false; //ya no estoy cargando mensajes
    }).catch(function (error) {
        console.log(error);
        cargando = false; //ya no estoy cargando mensajes
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

    //Cambio la barra de cabecera de chat
    chatContainer.classList.add("d-lg-flex", "flex-column");

    imagenCabeceraChat.setAttribute("src", appRoot + "seccion/" + chat.idEvento + "/pic");
    tituloCabeceraChat.textContent = chat.nombreEvento;
    tituloCabeceraChatMobile.textContent = chat.nombreEvento;

    //Reinicio la zona de mensajes
    eliminarMensajes();
    idUltimoEmisor = -1;
    ultimaFecha = new Date(0);
    ultimoContenedorMensaje = null;

    //Elimino el numero de mensajes no leidos del chat (como acabo de entrar ya se han leido)
    const indicadorMensajes = componente.querySelector('.badge');
    indicadorMensajes.classList.add('d-none');
    indicadorMensajes.textContent = 0;

    idEventoSeleccionado = chat.idEvento;
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
    chatDiv.innerHTML = `<img class="flex-shrink-0" width="55" height="55" src="${appRoot}seccion/${chat.idEvento}/pic" style="border-radius: 50%;">
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

        if (cargando || idEventoSeleccionado === chat.idEvento) return;
        cargando = true;

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

    if(propio){
        const menu = document.getElementById("menuPropio");
        const menuAgeno = document.getElementById("menuAgeno");

        nuevoMensajeDiv.addEventListener("contextmenu", function(e){
            e.preventDefault();

            idMensajeClicado = mensaje.id; 
            menu.style.left = `${e.pageX}px`;
            menu.style.top = `${e.pageY}px`;
            menu.classList.remove("desaparece");
            menuAgeno.classList.add("desaparece");
        });
    }
    else{
        const menu = document.getElementById("menuAgeno");
        const menuPropio = document.getElementById("menuPropio");

        nuevoMensajeDiv.addEventListener("contextmenu", function(e){
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

    contenedorGlobal.innerHTML = `<img class="flex-shrink-0" width="40" height="40" src="/user/${idUsuario}/pic" style="border-radius: 50%;">`;

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