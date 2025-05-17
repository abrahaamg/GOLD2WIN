package es.ucm.fdi.iw.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * An authorized user of the system.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@NamedQueries({
        @NamedQuery(name = "User.byUsername", query = "SELECT u FROM User u "
                + "WHERE u.username = :username AND u.enabled = TRUE"),
        @NamedQuery(name = "User.hasUsername", query = "SELECT COUNT(u) "
                + "FROM User u "
                + "WHERE u.username = :username"),
        @NamedQuery(name = "User.topics", query = "SELECT t.key "
                + "FROM Topic t JOIN t.members u "
                + "WHERE u.id = :id"),
        @NamedQuery(name = "User.getChats", query = "SELECT e FROM User u JOIN u.chats e WHERE u.id = :id"),
        @NamedQuery(name = "User.estaEnChat", query = "SELECT p FROM ParticipacionChat p WHERE p.usuario = :user AND p.evento = :evento"),
        @NamedQuery(name = "User.countChats", query = "SELECT COUNT(e) FROM User u JOIN u.chats e WHERE u.id = :id"),
        @NamedQuery(name = "User.countApuestas", query = "SELECT COUNT(a) FROM User u JOIN u.apuestas a WHERE u.id = :id"),
        @NamedQuery(name = "User.countApuestasPend", query = "SELECT COUNT(a) FROM User u JOIN u.apuestas a WHERE u.id = :id AND a.formulaApuesta.resultado = 'INDETERMINADO'"),
        @NamedQuery(name = "User.countMensajes", query = "SELECT COUNT(m) FROM User u JOIN u.mensajes m WHERE u.id = :id")
})
@Table(name = "IWUser")
public class User implements Transferable<User.Transfer> {

    public enum Role {
        USER, // normal users
        ADMIN, // admin users
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private long id;

    @Column(nullable = false, unique = true)
    private String username;
    @Column(nullable = false)
    private String password;

    private String firstName;
    private String lastName;
    private String email;

    private boolean enabled;
    private String roles; // split by ',' to separate roles
    // añadir tiempo de expulsion como vaiable
    private int dineroDisponible; // En centimos
    private int dineroRetenido; // En centimos

    private OffsetDateTime expulsadoHasta; 

    @OneToMany(mappedBy = "usuario")
    private List<ParticipacionChat> chats;

    @OneToMany(mappedBy = "apostador")
    private List<Apuesta> apuestas;

    @OneToMany(mappedBy = "remitente")
    private List<Mensaje> mensajes;

    @OneToMany
    @JoinColumn(name = "sender_id")
    private List<Message> sent = new ArrayList<>();
    @OneToMany
    @JoinColumn(name = "recipient_id")
    private List<Message> received = new ArrayList<>();

    /**
     * Checks whether this user has a given role.
     * 
     * @param role to check
     * @return true iff this user has that role.
     */
    public boolean hasRole(Role role) {
        String roleName = role.name();
        return Arrays.asList(roles.split(",")).contains(roleName);
    }

    @Getter
    @AllArgsConstructor
    public static class Transfer {
        private long id;
        private String username;
        private int totalReceived;
        private int totalSent;
    }

    @Override
    public Transfer toTransfer() {
        return new Transfer(id, username, received.size(), sent.size());
    }

    @Override
    public String toString() {
        return toTransfer().toString();
    }
}
