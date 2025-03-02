package es.ucm.fdi.iw.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Apuesta {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private Long id;
    
    private double cantidad;
    private boolean aFavor;
    
    @ManyToOne
    @JoinColumn(name = "apostador_id")
    private User apostador;
    
    @ManyToOne
    @JoinColumn(name = "formula")
    private FormulaApuesta formulaApuesta;
}
