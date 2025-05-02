package es.ucm.fdi.iw.model;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Variable implements Transferable<Variable.Transfer>{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private Long id;
    
    private String nombre;
    private String resolucion; // lo almacenamos como string para no tener que crear una tabla para cada tipo de variable y después lo parseamos en java
    private boolean numerico;  // true si la variable es numérica, false si es booleana
    
    @ManyToOne
    @JoinColumn(name = "id_evento")
    private Evento evento;

    @Getter
    @AllArgsConstructor
    public static class Transfer {
		private String nombre;
        private boolean numerico;
    }

    public Transfer toTransfer() {
        return new Transfer(nombre, numerico);
    }
}