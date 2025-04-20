var isDarkMode = document.documentElement.getAttribute("data-bs-theme") === "dark";

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
    document.getElementById(`contenedor${paginaActual}`).style.display = "none";
    document.getElementById(`contenedor${paginaElegida}`).style.display = "flex";
    document.getElementById(`boton${paginaActual}`).classList.remove("active");
    document.getElementById(`boton${paginaElegida}`).classList.add("active");
    paginaActual = paginaElegida;
}