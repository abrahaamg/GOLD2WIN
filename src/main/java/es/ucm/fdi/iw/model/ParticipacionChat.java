package es.ucm.fdi.iw.model;

import java.time.OffsetDateTime;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;


/* 
 * Clase intermedia para poder saber que mensajes ha leido un usuario en un chat
 * Dependiendo de la ultima fecha en la que haya visto el chat. (cuando entre se notifica)
 * Y cuando se recibe un mensaje por webSocket si se está en el chat tambien se actualiza
*/
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipacionChat implements Transferable<ParticipacionChat.Transfer> {

    @Id
    @ManyToOne
    private User usuario;

    @Id
    @ManyToOne
    private Evento evento;

    private OffsetDateTime ultimaVisita;

    @Getter
    @AllArgsConstructor
    public static class Transfer {
        private Evento.Transfer evento;
        private OffsetDateTime ultimaVisita;
        private OffsetDateTime fechaUltimoMensaje;
        private int mensajesNoLeidos;
    }

    @Override
    public Transfer toTransfer() {
        int mensajesNoLeidos = 0;
        OffsetDateTime ultimoMensaje = OffsetDateTime.MIN;

        int i = 0; 
        while(evento.getMensajes().size() > i && evento.getMensajes().get(i).getFechaEnvio().isBefore(ultimaVisita)) {
            mensajesNoLeidos++;
            i++;
        }

        if (evento.getMensajes().size() != 0){
            ultimoMensaje = evento.getMensajes().get(0).getFechaEnvio();
        }

        return new Transfer(getEvento().toTransfer(), ultimaVisita,ultimoMensaje, mensajesNoLeidos);
    }
}
