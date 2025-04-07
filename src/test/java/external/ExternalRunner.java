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
    Karate testVerApuestaExterna() {
        return Karate.run("verApuestaExterna").relativeTo(getClass());
    }  

    @Karate.Test
    Karate testCrearApuestaVista() {
        return Karate.run("crearApuestaVista").relativeTo(getClass());
    }

    @Karate.Test
    Karate testCrearEliminarSeccion() {
        return Karate.run("crearEliminarSeccion").relativeTo(getClass());
    }
}
