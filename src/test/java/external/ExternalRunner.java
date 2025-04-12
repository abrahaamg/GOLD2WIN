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
    Karate testDeterminarEvento() {  //esta prueba da error porque el servidor no responde al clickar el boton de determinar evento
        return Karate.run("determinarEvento").relativeTo(getClass());
    }
}
