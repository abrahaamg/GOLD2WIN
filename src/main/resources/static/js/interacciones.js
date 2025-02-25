document.querySelectorAll(".cambiadorTema").forEach(elemento => {
    elemento.addEventListener("click", function () {
        const html = document.documentElement;
        const newTheme = html.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
        html.setAttribute("data-bs-theme", newTheme);
        localStorage.setItem("theme", newTheme); // Guardar preferencia
    });
});


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

//Efectos al hacer apuesta
document.getElementById("apostarForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let cantidad = document.getElementById("cantidad").value;
    let tipoApuesta = document.getElementById("tipoApuesta").value;

    document.getElementById("ocultador-formulario").classList.add("invisible");
    let check = document.getElementById("confirmacionApuesta");
    check.classList.remove("invisible");
    check.style.animation = "fadeIn 0.5s ease-in-out";

    setTimeout(() => {
        location.reload();  // Recarga la página
    }, 1000);
    /*
    fetch("/apostar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({cantidad, tipoApuesta})
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.error); });
        }
        return response.json();
    })
    .then(data => {
        // Si la apuesta es exitosa, mostrar el ícono de éxito
        alert(data.mensaje);
        var modal = bootstrap.Modal.getInstance(document.getElementById('miModal'));
        modal.hide(); // Cierra el modal manualmente
        document.getElementById("cantidad").classList.remove("is-invalid");
        document.getElementById("cantidad").classList.add("is-valid");  // Marca como válida
    })
    .catch(error => {
        // Si hay un error (ej. saldo insuficiente), marcar el campo en rojo
        document.getElementById("cantidad").classList.add("is-invalid");
        document.getElementById("cantidadError").textContent = error.message;  // Mostrar el error
    });
    */
});

document.getElementById("crearApuestaForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const titulo = document.getElementById("tituloModal").value;
    const formula = document.getElementById("formulaModal").value;
    const cantidad = document.getElementById("cantidadModal2").value;
    const tipoApuesta = document.getElementById("tipoApuestaModal2").value;

    document.getElementById("ocultador-formulario2").classList.add("invisible");
    let check = document.getElementById("confirmacionApuesta2");
    check.classList.remove("invisible");
    check.style.animation = "fadeIn 0.5s ease-in-out";

    setTimeout(() => {
        location.reload();  // Recarga la página
    }, 1000);
    /*
    fetch("/apostar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({cantidad, tipoApuesta})
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.error); });
        }
        return response.json();
    })
    .then(data => {
        // Si la apuesta es exitosa, mostrar el ícono de éxito
        alert(data.mensaje);
        var modal = bootstrap.Modal.getInstance(document.getElementById('miModal'));
        modal.hide(); // Cierra el modal manualmente
        document.getElementById("cantidad").classList.remove("is-invalid");
        document.getElementById("cantidad").classList.add("is-valid");  // Marca como válida
    })
    .catch(error => {
        // Si hay un error (ej. saldo insuficiente), marcar el campo en rojo
        document.getElementById("cantidad").classList.add("is-invalid");
        document.getElementById("cantidadError").textContent = error.message;  // Mostrar el error
    });
    */
});