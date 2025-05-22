function ingresarDinero(event){
    let form = document.getElementById("ingresoDineroForm");
    if (!form.checkValidity()) {
        form.reportValidity(); 
        return;
    }

    const cant = document.getElementById("ingresoDineroInput").value;
    if(cant < 3 || cant > 1500){
        document.getElementById("ingresoDineroInput").classList.add("is-invalid");
        document.getElementById("mensajeErrorVar").classList.add("invalid-feedback");
        document.getElementById("mensajeErrorVar").style.display = 'block';
        return;
    }
    else{
        document.getElementById("ingresoDineroInput").classList.remove("is-invalid");
        document.getElementById("mensajeErrorVar").classList.remove("invalid-feedback");
        document.getElementById("mensajeErrorVar").style.display = 'none';
    }
 
    if (cant % 1 === 0) {
        const jsonData = {
            entera: cant,
            decimal: 0
        };

        go(`/cartera/ingresarDinero`, "Post", jsonData)
        .then(data => {
            console.log(data.mensaje);
            window.location.href = "/cartera/ingresar";
        })
        .catch(error => console.error("Error al ingresar dinero:", error));
    }
    else{
        let vEntera = Math.floor(cant);
        let vDecimal = Math.trunc((cant - vEntera +0.001)*100);
        const jsonData = {
            entera: vEntera,
            decimal: vDecimal
        };

        go(`/cartera/ingresarDinero`, "Post", jsonData)
        .then(data => {
            console.log(data.mensaje);
            window.location.href = "/cartera/ingresar";
        })
        .catch(error => console.error("Error al ingresar dinero:", error));
    } 
}

function retirarDinero() {
    let form = document.getElementById("retirarDineroForm");
    if (!form.checkValidity()) {
        form.reportValidity(); 
        return;
    }

    const cant = document.getElementById("retirarDineroInput").value;
    const dineroDisponible = document.getElementById("dineroDisponible").value;
    const cantAux = cant*100;
    if(cant < 5 || cant > 1000 || cantAux > dineroDisponible){
        document.getElementById("retirarDineroInput").classList.add("is-invalid");
        document.getElementById("mensajeErrorVar").classList.add("invalid-feedback");
        document.getElementById("mensajeErrorVar").style.display = 'block';
        return;
    }
    else{
        document.getElementById("retirarDineroInput").classList.remove("is-invalid");
        document.getElementById("mensajeErrorVar").classList.remove("invalid-feedback");
        document.getElementById("mensajeErrorVar").style.display = 'none';
    }

    if (cant % 1 === 0) {
        const jsonData = {
            entera: cant,
            decimal: 0
        };

        go(`/cartera/retirarDinero`, "Post", jsonData)
        .then(data => {
            console.log(data.mensaje);
            window.location.href = "/cartera/ingresar";
        })
        .catch(error => console.error("Error al retirar dinero:", error));
    }
    else{
        let vEntera = Math.floor(cant);
        let vDecimal = Math.trunc((cant - vEntera +0.001)*100);
        const jsonData = {
            entera: vEntera,
            decimal: vDecimal
        };

        go(`/cartera/retirarDinero`, "Post", jsonData)
        .then(data => {
            console.log(data.mensaje);
            window.location.href = "/cartera/ingresar";
        })
        .catch(error => console.error("Error al retirar dinero:", error));
    } 
}