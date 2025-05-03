package es.ucm.fdi.iw.model;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@NamedQueries({
        @NamedQuery(name = "Evento.getAllAfterDate", query = "SELECT e FROM Evento e WHERE e.fechaCierre > :inicio AND e.fechaCreacion < :inicio ORDER BY e.fechaCierre ASC"),
        @NamedQuery(name = "Evento.getAllAfterDateInSeccion", query = "SELECT e FROM Evento e WHERE (e.fechaCierre > :inicio AND e.fechaCreacion < :inicio AND e.seccion.id = :seccion) ORDER BY e.fechaCierre ASC"),
        @NamedQuery(name = "Evento.getBusqueda", query = "SELECT e FROM Evento e WHERE e.fechaCierre > :inicio AND e.fechaCreacion < :inicio AND (LOWER(e.nombre) LIKE LOWER(:nombre)) ORDER BY e.fechaCierre ASC"),
        @NamedQuery(name = "Evento.getBusquedaInSeccion", query = "SELECT e FROM Evento e WHERE e.fechaCierre > :inicio AND e.fechaCreacion < :inicio AND e.seccion.id = :seccionId AND (LOWER(e.nombre) LIKE LOWER(:nombre)) ORDER BY e.fechaCierre ASC")
})
public class Evento implements Transferable<Evento.Transfer> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private Long id;

    private String nombre;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaCierre;
    private boolean cancelado;
    private boolean determinado = false;

    @ElementCollection
    private List<String> etiquetas = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "seccion_id")
    private Seccion seccion;

    @OneToMany(mappedBy = "evento")
    @OrderBy("fechaEnvio ASC")
    private List<Mensaje> mensajes;

    @OneToMany(mappedBy = "evento")
    private List<ParticipacionChat> usuariosDelChat;

    @OneToMany(mappedBy = "evento")
    private List<FormulaApuesta> formulasApuestas;

    @OneToMany(mappedBy = "evento")
    private List<Variable> variables;

    // COSAS PARA MANDAR DATOS CON AJAX A JS
    @Getter
    @AllArgsConstructor
    public static class Transfer {
        private long id;
        private String nombre;
        private OffsetDateTime fechaCreacion;
        private OffsetDateTime fechaCierre;
        private boolean cancelado;
        private List<String> etiquetas;
        private Long seccionId;
    }

    @Override
    public Transfer toTransfer() {
        return new Transfer(id, nombre, fechaCreacion, fechaCierre, cancelado, etiquetas, seccion.getId());
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

    @Transient
    public boolean isPasado() {
        return fechaCierre.isBefore(OffsetDateTime.now());
    }

}