package es.ucm.fdi.iw.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mensaje {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "remitente")
    private User remitente;

    private String contenido;
    private LocalDateTime fechaEnvio;
    private boolean enabled;

    // El evento en el que se envía el mensaje (puede ser null si es en chat)
    @ManyToOne
    @JoinColumn(name = "id_evento")
    private Evento evento;

    // El chat en el que se envía el mensaje (puede ser null si es en evento)
    @ManyToOne
    @JoinColumn(name = "chat_id")
    private Chat chat;

    @OneToMany(mappedBy = "mensajeReportado")
    private List<Reporte> reportes;
}
