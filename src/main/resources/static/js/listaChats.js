const appRoot = document.getElementById('root').value; //th:href="@{/}"
var idUltimoEmisor = -1; //saber quien fue el ultimo en mandar un mensaje
var ultimaFecha = new Date(0); //saber la fecha del ultimo mensaje
var ultimoContenedorMensaje = null; //saber el contenedor del ultimo mensaje
var idEventoSeleccionado = -1;

//El boton apostar del chat redirige al ID del evento conteniedo en "idEventoSeleccionado"
document.addEventListener('DOMContentLoaded', function () {
    const botonApostarCabecera = document.getElementById('botonApostarCabecera');

    if (botonApostarCabecera) {
        botonApostarCabecera.addEventListener('click', function () {
            window.location.href = `${appRoot}evento/${idEventoSeleccionado}/apostar`;
        });
    }
});

//Al cargar la pagina se pide al servidor una lista de los chats a los que esta suscrito el usuario
//Esto permite no repetir codigo en html del servidor ya que las funciones de insertar chat/mensaje se van a tener
//que usar en el js obligatoriamente al llegar un mensaje nuevo (un chat que esta abajo en la lista se elimina y añade arriba)
function cargarChats(){
    go(appRoot + 'chats/cargarChats', 'GET').then(function (data) {
        listaChats = [];
        data.chats.forEach(chat => {
            listaChats.push({evento: chat.evento, fechaUltimoMensaje: new Date(chat.fechaUltimoMensaje),ultimaVisita: new Date(chat.ultimaVisita), mensajesNoLeidos: chat.mensajesNoLeidos});
        });

        listaChats.forEach(chat => {
            anadirChat(chat);
        });
    }).catch(function (error) {

    });
}

//Al puslar un chat se eliminan los mensajes del chat anterior, cambia la imagen del chat, el nombre y cambia la variable idEventoSeleccionado
//idEventoSeleccionado permite que al pulsar el boton de apostar sepa a que evento redirigir sin tener que cambiar la funcion onClick cada vez
function seleccionarChat(chat){
    const chatContainer = document.getElementById("chatContainer");
    const imagenCabeceraChat = document.getElementById("imagenCabeceraChat");
    const tituloCabeceraChat = document.getElementById("tituloCabeceraChat");

    chatContainer.classList.remove("d-none");
    chatContainer.classList.add("d-flex", "flex-column");

    imagenCabeceraChat.setAttribute("src", appRoot + "seccion/" + chat.idEvento + "/pic");
    tituloCabeceraChat.textContent = chat.nombreEvento;

    eliminarMensajes();

    idEventoSeleccionado = chat.idEvento;
}

//chat: {idEvento, mensajesNoLeidos, ultimoMensaje, fechaUltimoMensaje, nombreEvento}
//Añado un chat a la lista de chats, ordenandolo por fecha de ultimo mensaje
function anadirChat(chat){
    var chatDiv = document.createElement('div');
    chatDiv.setAttribute('data-fecha', chat.fechaUltimoMensaje);
    chatDiv.setAttribute('data-idEvento', chat.idEvento);
    chatDiv.setAttribute('role', 'button');
    chatDiv.setAttribute('class', 'd-flex w-100 mt-2 p-2 resaltaHover');
    chatDiv.setAttribute('style', 'border-radius: 15px;');
    chatDiv.innerHTML= `<img width="55" height="55" src="${appRoot}seccion/${chat.idEvento}/pic" style="border-radius: 50%;">
                        <div class="d-flex flex-column h-100 justify-content-center ms-2 flex-grow-1">
                            <div class="d-flex flex-row justify-content-between">
                                <h5 class="m-0">${chat.nombreEvento}</h5>
                                <span class="ms-auto mb-auto" style="font-size: 14px;"> ${formatearFechaMensaje(chat.fechaUltimoMensaje)}</span>
                            </div>
                            
                            <p class="m-0 mt-1" style="font-size: 14px;">${chat.ultimoMensaje}</p>
                        </div>`;
    
    chatDiv.addEventListener('click', function () {
        seleccionarChat(chat);
    });

    insertarChatOrdenado(chatDiv);
}

//mensaje: {id, idEmisor, emisor, contenido, fecha}
//Añado un mensaje al chat abierto, si es del mismo emisor que el anterior lo agrupo sino creo un nuevo grupo
function anadirMensajeAbajo(mensaje){
    var nuevoMensajeDiv = document.createElement('div');
    nuevoMensajeDiv.setAttribute('class', 'mensaje mt-1 pb-1 pt-2 me-auto text-wrap text-break');
    nuevoMensajeDiv.setAttribute('speech-bubble', '');

    if(normalizarFecha(ultimaFecha) < normalizarFecha(new Date(mensaje.fecha))){
        ultimaFecha = new Date(mensaje.fecha);
        insertarSeparador(formatearFechaMensaje(mensaje.fecha));
        idUltimoEmisor = -1;
    }

    if (mensaje.idEmisor != idUltimoEmisor){
        insertarGrupoMensajes(mensaje.idEmisor);
        idUltimoEmisor = mensaje.idEmisor;

        nuevoMensajeDiv.setAttribute('style', 'max-width: 650px; min-width: 250px;');
        nuevoMensajeDiv.setAttribute('pleft', '');
        nuevoMensajeDiv.setAttribute('atop', '');
        nuevoMensajeDiv.innerHTML= `<div class="fw-bold text-success mb-1">${mensaje.emisor}</div>
                                    <p class="mb-1">${mensaje.contenido}</p>
                                    <div class="text-end">
                                        <span class="text-secondary small">${obtenerHora(mensaje.fecha)}</span>
                                    </div>`;
    }
    else{
        nuevoMensajeDiv.setAttribute('style', 'max-width: 650px;min-width: 250px;margin-left: 24px;');
        nuevoMensajeDiv.innerHTML= `<p class="mb-1">${mensaje.contenido}</p>
                                    <div class="text-end">
                                        <span class="text-secondary small">${obtenerHora(mensaje.fecha)}</span>
                                    </div>`;
    }

    ultimoContenedorMensaje.appendChild(nuevoMensajeDiv);
}

//Obtengo la fecha en formato para mostrar a la derecha del evento
function formatearFechaMensaje(fecha){
    var fecha = new Date(fecha);
    var hoy = new Date();
    if (fecha.getDate() == hoy.getDate() && fecha.getMonth() == hoy.getMonth() && fecha.getFullYear() == hoy.getFullYear()){
        return fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }else{
        return fecha.toLocaleDateString([], {year: 'numeric', month: '2-digit', day: '2-digit'});
    }
}

//Obtengo solo la hora para mostrarlo en el mensaje
function obtenerHora(fecha){
    var fecha = new Date(fecha);
    return fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

//Añado en la parte de abajo del chat un separador con la fecha de los mensajes de abajo
function insertarSeparador(texto){
    const contenedorMensajes = document.getElementById("contenedorMensajes");

    var nuevoSeparador = document.createElement('div');
    nuevoSeparador.setAttribute('style', 'border-radius: 10px;');
    nuevoSeparador.setAttribute('class', 'py-2 px-3 my-2 text-center flex-shrink-0 ms-auto me-auto separadorMensajes');
    nuevoSeparador.innerHTML= `<span>${texto}</span>`;

    contenedorMensajes.appendChild(nuevoSeparador);
}

//Inserto un grupo de mensajes de un mismo emisor. (imagenPerfil + nombre + mensaje con estilo de bocadillo)
function insertarGrupoMensajes(idUsuario){
    const contenedorMensajes = document.getElementById("contenedorMensajes");
    var contenedorGlobal = document.createElement('div');
    contenedorGlobal.setAttribute('class', 'd-flex flex-row mt-2');
    contenedorGlobal.innerHTML = `<img width="40" height="40" class="mt-3" src="/user/${idUsuario}/pic" style="border-radius: 50%;">`;

    ultimoContenedorMensaje = document.createElement('div');
    ultimoContenedorMensaje.setAttribute('class', 'd-flex flex-column ms-2');
    contenedorGlobal.appendChild(ultimoContenedorMensaje);

    contenedorMensajes.appendChild(contenedorGlobal);
}

//Permite introducir el componente ya creado de evento de manera ordenada (se usa en anadirChat)
function insertarChatOrdenado(nuevoChatDiv) {
    const contenedor = document.getElementById('queryEventos').parentElement;
    const hijos = Array.from(contenedor.children);

    // Ignora el input buscador
    const nuevaFecha = new Date(nuevoChatDiv.getAttribute('data-fecha'));

    let insertado = false;
    for (let i = 0; i < hijos.length; i++) {
        const actual = hijos[i];
        if (actual.id === 'queryEventos' || actual.id === "tituloChats") continue; // saltamos el input

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
function eliminarMensajes(){
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