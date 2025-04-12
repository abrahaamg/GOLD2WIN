package es.ucm.fdi.iw.model;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Evento implements Transferable<Evento.Transfer>{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private Long id;
    
    private String nombre;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaCierre;
    private boolean cancelado;
    private boolean determinado = false;

    @ElementCollection
    private List<String> etiquetas = new ArrayList<>();
    
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

    //COSAS PARA MANDAR DATOS CON AJAX A JS
    @Getter
    @AllArgsConstructor
    public static class Transfer {
        private long id;
		private String nombre;
        private LocalDateTime fechaCreacion;
        private LocalDateTime fechaCierre;
        private boolean cancelado;
        private List<String> etiquetas;
        private Long seccionId;
    }

    @Override
    public Transfer toTransfer() {
		return new Transfer(id,	nombre, fechaCreacion, fechaCierre, cancelado, etiquetas, seccion.getId());
	}
	
	@Override
	public String toString() {
		return toTransfer().toString();
	}

    public boolean isCancelado() {
        return cancelado;
    }

    public void setCancelado(boolean cancelado) {
        this.cancelado = cancelado;
    }
    
}