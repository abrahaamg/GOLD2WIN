const appRoot = document.getElementById('root').value; //th:href="@{/}"
const userId = document.getElementById('userId').value; //Id del usuario logueado

var idUltimoEmisor = -1; //saber quien fue el ultimo en mandar un mensaje
var ultimaFecha = new Date(0); //saber la fecha del ultimo mensaje
var ultimoContenedorMensaje = null; //saber el contenedor del ultimo mensaje
var idEventoSeleccionado = -1;
var contenedorEventoSeleccionado = null; //Contenedor del evento seleccionado (para eliminar el estilo de seleccionado)

//El boton apostar del chat redirige al ID del evento conteniedo en "idEventoSeleccionado"
document.addEventListener('DOMContentLoaded', function () {
    const botonApostarCabecera = document.getElementById('botonApostarCabecera');
    const buscador = document.getElementById('queryEventos');

    if (botonApostarCabecera) {
        botonApostarCabecera.addEventListener('click', function () {
            window.location.href = `${appRoot}evento/${idEventoSeleccionado}/apostar`;
        });
    }

    if(buscador){
        buscador.addEventListener('keypress', function (event) {
            if (event.key === "Enter") {
                var busqueda = document.getElementById("queryEventos").value;
                buscarChat(busqueda);
            }
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
function seleccionarChat(chat,componente){
    const chatContainer = document.getElementById("chatContainer");
    const imagenCabeceraChat = document.getElementById("imagenCabeceraChat");
    const tituloCabeceraChat = document.getElementById("tituloCabeceraChat");

    //Elimino el numero de mensajes no leidos del chat (como acabo de entrar ya se han leido)
    const indicadorMensajes = componente.querySelector('.badge');
    indicadorMensajes.classList.add('d-none');
    indicadorMensajes.textContent = 0;

    //Cambio la barra de cabecera de chat
    chatContainer.classList.remove("d-none");
    chatContainer.classList.add("d-flex", "flex-column");

    imagenCabeceraChat.setAttribute("src", appRoot + "seccion/" + chat.idEvento + "/pic");
    tituloCabeceraChat.textContent = chat.nombreEvento;

    //Reinicio la zona de mensajes
    eliminarMensajes();
    idUltimoEmisor = -1;
    ultimaFecha = new Date(0);
    ultimoContenedorMensaje = null;

    idEventoSeleccionado = chat.idEvento;
}

//chat: {idEvento, mensajesNoLeidos, ultimoMensaje, fechaUltimoMensaje, nombreEvento}
//Añado un chat a la lista de chats, ordenandolo por fecha de ultimo mensaje
function anadirChat(chat){
    let textoNumMensajes = chat.mensajesNoLeidos == 0 ? '' : chat.mensajesNoLeidos >= 100 ? '99+' : chat.mensajesNoLeidos; //si hay muchos mensajes se pone 99+
    let chatDiv = document.createElement('div');
    chatDiv.setAttribute('data-fecha', chat.fechaUltimoMensaje); //guardamos la fecha en el HTML para ordenar previamente sin variables extras en el JS
    chatDiv.setAttribute('data-idEvento', chat.idEvento); //No se usa pero por si acaso hace falta en el futuro
    chatDiv.setAttribute('data-nombreEvento', chat.nombreEvento); //Guardamos el nombre para que en la lupa podamos saber si conicide con la busqueda
    chatDiv.setAttribute('role', 'button');
    chatDiv.setAttribute('class', 'd-flex w-100 mt-2 p-2 resaltaHover');
    chatDiv.setAttribute('style', 'border-radius: 15px;');
    chatDiv.innerHTML= `<img width="55" height="55" src="${appRoot}seccion/${chat.idEvento}/pic" style="border-radius: 50%;">
                        <div class="d-flex flex-column h-100 justify-content-center ms-2 flex-grow-1" style="max-width: 215px;">
                            <div class="d-flex flex-row justify-content-between">
                                <h5 class="m-0">${chat.nombreEvento}</h5>
                                <span class="ms-auto mb-auto px-1" style="font-size: 14px;"> ${formatearFechaMensaje(chat.fechaUltimoMensaje)}</span>
                            </div>
                            
                            <div class="d-flex flex-row justify-content-between">
                                <p class="m-0 mt-1 .text-nowrap text-truncate" style="font-size: 14px;">${chat.ultimoMensaje}</p>
                                <span class="indicadorMensajes ms-2 badge bg-primary ${chat.mensajesNoLeidos == 0 ? 'd-none' : ''}" style="font-size: 12px;border-radius: 25px;">${textoNumMensajes}</span>
                            </div>
                        </div>`;
    
    chatDiv.addEventListener('click', function () {
        if(contenedorEventoSeleccionado) contenedorEventoSeleccionado.classList.remove("resaltaHoverSelected"); 
        chatDiv.classList.add("resaltaHoverSelected");
        contenedorEventoSeleccionado = chatDiv;
        
        seleccionarChat(chat, chatDiv);
    });

    insertarChatOrdenado(chatDiv);
}

//Hace invisibles todos los chats que no contengan la busqueda en su nombre (data-nombreEvento)
//Por otro lado hace visibles los que contengan la busqueda por si se han hecho invisibles previamente
//(no se llegan a eliminar del HTML solo se ocultan)
function buscarChat(busqueda){
    const contenedor = document.getElementById('contenedorChats');
    const hijos = Array.from(contenedor.children);
    busqueda = busqueda.toLowerCase(); //normalizo la busqueda a minusculas

    if(busqueda === ""){
        //si la lupa esta vacia se muestran todos los chats
        hijos.forEach(componente => {
            componente.classList.remove('d-none');
            componente.classList.add('d-flex');
        });
    }
    else{
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
function anadirMensajeAbajo(mensaje){
    const propio = mensaje.idEmisor == userId; //si el mensaje es del usuario logueado
    var nuevoMensajeDiv = document.createElement('div');
    nuevoMensajeDiv.setAttribute('class', 'mensaje mt-1 pb-1 pt-2 text-wrap text-break');

    if(propio) nuevoMensajeDiv.classList.add('ms-auto');
    else nuevoMensajeDiv.classList.add('me-auto');

    nuevoMensajeDiv.setAttribute('speech-bubble', '');

    if(normalizarFecha(ultimaFecha) < normalizarFecha(new Date(mensaje.fecha))){
        ultimaFecha = new Date(mensaje.fecha);
        insertarSeparador(formatearFechaMensaje(mensaje.fecha));
        idUltimoEmisor = -1;
    }

    if (mensaje.idEmisor != idUltimoEmisor){
        insertarGrupoMensajes(mensaje.idEmisor,propio);
        idUltimoEmisor = mensaje.idEmisor;

        nuevoMensajeDiv.setAttribute('style', 'max-width: 650px; min-width: 250px;');

        if(propio)nuevoMensajeDiv.setAttribute('pright', '');
        else nuevoMensajeDiv.setAttribute('pleft', '');

        nuevoMensajeDiv.setAttribute('atop', '');
        nuevoMensajeDiv.innerHTML= `<div class="fw-bold text-success mb-1">${mensaje.emisor}</div>
                                    <p class="mb-1">${mensaje.contenido}</p>
                                    <div class="text-end">
                                        <span class="text-secondary small">${obtenerHora(mensaje.fecha)}</span>
                                    </div>`;
    }
    else{
        nuevoMensajeDiv.setAttribute('style', 'max-width: 650px;min-width: 250px;');

        if(!propio) nuevoMensajeDiv.setAttribute("style", nuevoMensajeDiv.getAttribute("style") + "margin-left: 24px;");
        else nuevoMensajeDiv.setAttribute("style", nuevoMensajeDiv.getAttribute("style") + "margin-right: 24px;");

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
function insertarGrupoMensajes(idUsuario,propio){
    const contenedorMensajes = document.getElementById("contenedorMensajes");
    var contenedorGlobal = document.createElement('div');
    contenedorGlobal.setAttribute('class', 'd-flex flex-row mt-2');

    contenedorGlobal.innerHTML = `<img width="40" height="40" src="/user/${idUsuario}/pic" style="border-radius: 50%;">`;

    ultimoContenedorMensaje = document.createElement('div');
    if(propio) ultimoContenedorMensaje.setAttribute('class', 'd-flex flex-column mx-2 ms-auto');
    else ultimoContenedorMensaje.setAttribute('class', 'd-flex flex-column mx-2');
    

    if(propio) contenedorGlobal.prepend(ultimoContenedorMensaje);
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