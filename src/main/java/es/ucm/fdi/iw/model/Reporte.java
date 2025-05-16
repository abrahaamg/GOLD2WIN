package es.ucm.fdi.iw.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

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
    private OffsetDateTime fechaEnvio;
    private boolean resuelto;
    private OffsetDateTime fechaResolucion;
}
