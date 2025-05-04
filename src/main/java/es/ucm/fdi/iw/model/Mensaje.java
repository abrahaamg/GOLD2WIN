package es.ucm.fdi.iw.model;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mensaje implements Transferable<Mensaje.Transfer> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "remitente")
    private User remitente;

    private String contenido;

    @Column(name = "fechaEnvio")
    private OffsetDateTime fechaEnvio;

    private boolean enabled;

    // El evento en el que se envía el mensaje (puede ser null si es en chat)
    @ManyToOne
    @JoinColumn(name = "id_evento")
    private Evento evento;

    @OneToMany(mappedBy = "mensajeReportado")
    private List<Reporte> reportes;

    @Getter
    @AllArgsConstructor
    public static class Transfer {
        private long id;
        private long idEmisor;
        private String emisor;
        private String contenido;
        private String fecha; //tiene que ser String porque jackson no sabe serializar OffsetDateTime
    }

    @Override
    public Transfer toTransfer() {
        return new Transfer(id, remitente.getId(), remitente.getUsername(), contenido, fechaEnvio.toString());
    }
}
