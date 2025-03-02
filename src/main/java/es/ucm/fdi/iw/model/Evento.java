package es.ucm.fdi.iw.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Evento {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private Long id;
    
    private String nombre;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaCierre;
    private boolean cancelado;

    @ElementCollection
    private List<String> etiqueta = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "seccion_id")
    private Seccion seccion;
    
    @OneToMany(mappedBy = "evento")
    private List<Mensaje> mensajes;
    
    @ManyToMany(mappedBy = "chats")
    private List<User> usuariosDelChat;
    
    @OneToMany(mappedBy = "evento")
    private List<FormulaApuesta> formulasApuestas;

    @OneToMany(mappedBy = "evento")
    private List<Variable> variables;
}