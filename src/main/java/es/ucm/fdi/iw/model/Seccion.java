package es.ucm.fdi.iw.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seccion {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private Long id;
    
    private String nombre;
    private String grupo;
    private boolean enabled;
    
    // Lista de variables definidas en esta sección
    @OneToMany(mappedBy = "seccion")
    private List<VariableSeccion> plantilla;
    
    // Eventos que usan esta sección
    @OneToMany(mappedBy = "seccion")
    private List<Evento> eventos;
}