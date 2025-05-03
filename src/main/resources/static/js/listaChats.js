const appRoot = document.getElementById('root').value; //th:href="@{/}"

cargarChats();

function cargarChats(){
    go(appRoot + 'chats/cargarChats', 'GET').then(function (data) {
        listaChats = [];
        data.chats.forEach(chat => {
            listaChats.push({evento: chat.evento, fechaUltimoMensaje: new Date(chat.fechaUltimoMensaje),ultimaVisita: new Date(chat.ultimaVisita), mensajesNoLeidos: chat.mensajesNoLeidos});
        });

        listaChats.sort(function(a, b) {
            return b.fechaUltimoMensaje - a.fechaUltimoMensaje;
        });

        listaChats.forEach(chat => {
            anadirChatFinal(chat);
        });
    }).catch(function (error) {

    });
}

//chat:{evento, ultimaVisita, mensajesNoLeidos}
function anadirChatFinal(chat){
    let contenedor = document.getElementById("contenedorChats");

    let chatMovil = document.createElement("a");
    chatMovil.href = appRoot + "chats/" + evento.id;
    chatMovil.className = "nav-link estilo-contenedor-adaptable w-100 px-2 py-2 d-flex d-sm-none";
    chatMovil.style = "margin: 15px 0px; min-height: 98px; max-height: 98px;";
    chatMovil.id = "contenedorChat-"+evento.id;
    chatMovil.setAttribute("data-fecha-evento",evento.fechaCierre);
    chatMovil.setAttribute("name","apostar");
    
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

                            </div>

                            <div class="ms-2 caja-etiquetas scrollBarPerso">`;

    evento.etiquetas.forEach(etiqueta => {
        html += '<span class="etiquetaEvento text-nowrap">'+etiqueta+'</span>\n';
    });

    html += `</div></div>`;

    chatMovil.innerHTML = html;

    let chatOrdenador = document.createElement("a");
    chatOrdenador.href = appRoot + "evento/" + evento.id+"/apostar";
    chatOrdenador.className = "nav-link d-none d-sm-inline-flex flex-column estilo-contenedor-adaptable px-3 py-2 align-items-start Evento ";
    chatOrdenador.setAttribute("name","apostar");
    chatOrdenador.id = "contenedorChat-"+evento.id;
    chatOrdenador.setAttribute("data-fecha-evento",evento.fechaCierre);

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

                        </div>
                        <div class="caja-etiquetas scrollBarPerso">`

    evento.etiquetas.forEach(etiqueta => {
        htmlOrdenador += '<span class="etiquetaEvento text-nowrap">'+etiqueta+'</span>\n';
    });
    htmlOrdenador += `</div>`;

    chatOrdenador.innerHTML = htmlOrdenador;

    contenedor.appendChild(chatMovil);
    contenedor.appendChild(chatOrdenador);
}