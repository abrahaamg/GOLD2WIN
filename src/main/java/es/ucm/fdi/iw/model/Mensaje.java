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
    @JoinColumn(name="remitente")
    private User remitente;
    
    private String contenido;
    private LocalDateTime fechaEnvio;
    private boolean enabled;
    
    // El chat en el que se envía el mensaje
    @ManyToOne
    @JoinColumn(name = "id_evento")
    private Evento evento;

    @OneToMany(mappedBy = "mensajeReportado")
    private List<Reporte> reportes;
}