package es.ucm.fdi.iw.model;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@NamedQueries({
    @NamedQuery(name = "Apuesta.getAllAfterDate", query = "SELECT e FROM Apuesta e WHERE e.fechaCreacion < :inicio AND e.apostador.id = :id ORDER BY e.fechaCreacion ASC"),
    @NamedQuery(name = "Apuesta.getDeterminadaAfterDate", query = "SELECT e FROM Apuesta e WHERE e.fechaCreacion < :inicio AND e.formulaApuesta.resultado IN ('GANADO', 'PERDIDO') AND e.apostador.id = :id ORDER BY e.fechaCreacion ASC"),
    @NamedQuery(name = "Apuesta.getPendienteAfterDate", query = "SELECT e FROM Apuesta e WHERE e.fechaCreacion < :inicio AND e.formulaApuesta.resultado = 'INDETERMINADO' AND e.apostador.id = :id ORDER BY e.fechaCreacion ASC")
})

public class Apuesta implements Transferable<Apuesta.Transfer> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private Long id;
    
    private int cantidad; //En centimos
    private boolean aFavor;
    private OffsetDateTime fechaCreacion;
    
    @ManyToOne
    @JoinColumn(name = "apostador_id")
    private User apostador;
    
    @ManyToOne
    @JoinColumn(name = "formula")
    private FormulaApuesta formulaApuesta;

    // COSAS PARA MANDAR DATOS CON AJAX A JS
    @Getter
    @AllArgsConstructor
    public static class Transfer {
        private long id;
        private int cantidad;
        private OffsetDateTime fechaCierre;

        private double cuotaFaborable;
        private double cuotaDesfavorable;

        private String nombreEvento;
        private String nombreSeccion;
        private String nombreFormula;
        private String formula;

        private String estado; // "Pendiente", "Ganada", "Perdida", "Error"
        private boolean aFavor;
    }

    @Override
    public Transfer toTransfer() {
        String estado;

        if (formulaApuesta.getResultado() == Resultado.INDETERMINADO) 
            estado = "Pendiente";
        else if ((formulaApuesta.getResultado() == Resultado.GANADO && aFavor) || (formulaApuesta.getResultado() == Resultado.PERDIDO && !aFavor))
            estado = "Ganada";
        else 
            estado = "Perdida";
        
        Transfer res = new Transfer(id,cantidad,
                formulaApuesta.getEvento().getFechaCierre(),
                formulaApuesta.calcularCuota(true),
                formulaApuesta.calcularCuota(false),
                formulaApuesta.getEvento().getNombre(),
                formulaApuesta.getEvento().getSeccion().getNombre(),
                formulaApuesta.getNombre(),
                formulaApuesta.getFormula(),
                estado,
                aFavor);

        return res;
    }
}
