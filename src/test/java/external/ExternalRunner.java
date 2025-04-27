package external;

import com.intuit.karate.junit5.Karate;

class ExternalRunner {

    @Karate.Test
    Karate testLogin() {
        return Karate.run("login").relativeTo(getClass());
    }    

    @Karate.Test
    Karate testWs() {
        return Karate.run("ws").relativeTo(getClass());
    }  

    @Karate.Test
    Karate testCrearFormulaApuesta() {
        return Karate.run("crearFormulaApuesta").relativeTo(getClass());
    }  

    @Karate.Test
    Karate testCrearApuesta() {
        return Karate.run("crearApuesta").relativeTo(getClass());
    }

    @Karate.Test
    Karate testDeterminarEvento() {  //esta prueba da error porque el go del boton de determinar da error
        return Karate.run("determinarEvento").relativeTo(getClass());
    }

    @Karate.Test
    Karate testProbarSeccion() {  
        return Karate.run("crear-editarSeccion").relativeTo(getClass());
    }

    @Karate.Test
    Karate testCrearEliminarSeccion() {
        return Karate.run("crearEliminarSeccion").relativeTo(getClass());
    }
}
