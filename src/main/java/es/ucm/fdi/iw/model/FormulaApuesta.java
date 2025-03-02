package es.ucm.fdi.iw.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormulaApuesta {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "evento_id")
    private Evento evento;
    
    @ManyToOne
    @JoinColumn(name = "creador_id")
    private User creador;
    
    private String formula;
    private String nombre;
    private double dineroAfabor;
    private double dineroEnContra;
    private boolean terminada;
    private boolean resultado;
    
    @OneToMany(mappedBy = "formulaApuesta")
    private List<Apuesta> apuestas;
}
