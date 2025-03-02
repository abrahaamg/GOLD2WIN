package es.ucm.fdi.iw.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reporte {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "id_reportador")
    private User reportador;
    
    @ManyToOne
    @JoinColumn(name = "id_mensaje")
    private Mensaje mensajeReportado;
    
    private String motivo;
    private LocalDateTime fechaEnvio;
    private boolean resuelto;
    private LocalDateTime fechaResolucion;
}
