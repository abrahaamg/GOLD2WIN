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
    Karate testPruebaPrincipal() { //Prueba de la funcionalidad principal de la aplicación
        return Karate.run("pruebaPrincipal").relativeTo(getClass());
    } 
    
    @Karate.Test
    Karate testDeterminarEvento() {  
        return Karate.run("determinarEvento").relativeTo(getClass());
    }

    @Karate.Test
    Karate testCrearApuesta() {
        return Karate.run("crearApuesta").relativeTo(getClass());
    }

    @Karate.Test
    Karate testCrearFormulaApuesta() {
        return Karate.run("crearFormulaApuesta").relativeTo(getClass());
    }  
}
