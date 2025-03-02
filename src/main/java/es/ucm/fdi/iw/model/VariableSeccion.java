package es.ucm.fdi.iw.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.*;

/*Estas variables no se pueden resolver solo son orientativas*/

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VariableSeccion {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private Long id;
    
    private String nombre;
    private boolean numerico;  // true si la variable es numérica, false si es booleana
    
    @ManyToOne
    @JoinColumn(name = "id_seccion")
    private Seccion seccion;
}