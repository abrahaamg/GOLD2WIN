package es.ucm.fdi.iw.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Un chat entre varios usuarios.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@NamedQueries({
    @NamedQuery(name="Chat.getByUserId",
        query="SELECT c FROM Chat c JOIN c.usuarios u WHERE u.id = :userId")
})
@Table(name = "Chat")
public class Chat implements Transferable<Chat.Transfer> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private Long id;

    private String nombre;
    private OffsetDateTime fechaCreacion;

    @ManyToMany
    @JoinTable(
        name = "chat_usuario",
        joinColumns = @JoinColumn(name = "chat_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private List<User> usuarios = new ArrayList<>();

    @OneToMany(mappedBy = "chat")
    private List<Mensaje> mensajes = new ArrayList<>();

    @Getter
    @AllArgsConstructor
    public static class Transfer {
        private long id;
        private String nombre;
        private OffsetDateTime fechaCreacion;
        private List<Long> usuarioIds;
    }

    @Override
    public Transfer toTransfer() {
        return new Transfer(
            id,
            nombre,
            fechaCreacion,
            usuarios.stream()
                    .map(User::getId)
                    .toList()
        );
    }

    @Override
    public String toString() {
        return toTransfer().toString();
    }
}
