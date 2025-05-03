package es.ucm.fdi.iw.controller;

import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

import es.ucm.fdi.iw.model.Evento;
import es.ucm.fdi.iw.model.Mensaje;
import es.ucm.fdi.iw.model.ParticipacionChat;
import es.ucm.fdi.iw.model.Seccion;
import es.ucm.fdi.iw.model.Transferable;
import es.ucm.fdi.iw.model.User;

@Controller
@RequestMapping("chats")
public class ChatController {

    @Autowired
    private EntityManager entityManager;

    // Este método carga los eventos disponibles para los chats y los pasa al modelo
    @GetMapping("/")
    public String chats(Model model) {
        // obtengo las secciones
        List<Seccion> secciones = entityManager.createNamedQuery("Seccion.getAll", Seccion.class).getResultList();

        // añado los eventos y las secciones al modelo
        model.addAttribute("secciones", secciones);
        model.addAttribute("selectedSeccion", -1);

        return "chats";
    }

    @GetMapping(path = "/cargarChats", produces = "application/json")
    @ResponseBody
    public Map<String, Object> cargarChats(HttpSession session) {
        User user = (User) session.getAttribute("u");
        Map<String, Object> response = new HashMap<>();

        List<ParticipacionChat> participacionChat = entityManager.createNamedQuery("User.getChats", ParticipacionChat.class)
            .setParameter("id", user.getId())
            .getResultList();

        List<ParticipacionChat.Transfer> transferibles = participacionChat.stream()
            .map(Transferable::toTransfer)
            .sorted(Comparator.comparingInt(ParticipacionChat.Transfer::getMensajesNoLeidos).reversed()) // mayor a menor
            .collect(Collectors.toList());
        
        response.put("chats", transferibles);
        
        return response; //Este es el nombre de la vista para mostrar los chats
    }

    // Este método es para ver un chat específico de un evento
    @GetMapping("/{id}")
    @Transactional
    public String verChat(@PathVariable long id, Model model, HttpSession session) {
        User user = (User) session.getAttribute("u");
        Evento evento = entityManager.find(Evento.class, id);
        if (user == null) {
            return "redirect:/login";
        }

        if(evento == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");
        }

        boolean pertenece = !entityManager.createNamedQuery("User.estaEnChat", ParticipacionChat.class)
                .setParameter("user", user)
                .setParameter("evento", evento)
                .getResultList().isEmpty();

        if(pertenece) {
           /*AQUI ABRAHAM TIENE QUE HACER LO QUE TENGA QUE HACER (CARGAR MENSAJES, IMAGENES DE LOS USUARIOS, ETC).
            * Deberias añadir los mensajes desde el JS porque despues pueden aparecer nuevos mensajes y el profe dijo 
            * que o se usa TH o js y con TH no se pueden añadir nuevos. Tienes que crear un nuevo metodo controlador 
            * que devuelva la lista de mensajes con transaccionals.
            * (tendrás que definir transaccionals nuevos que no tienen porque estar en la interfaz Transaccional del profe)
            * si quieres cuando tengas eso yo me encargo de los webSockets.
            */
        } else {
            // Si no está en el chat, lo añadimos
            ParticipacionChat participacionChat = new ParticipacionChat(user, evento, OffsetDateTime.now()); //acaba de entrar 
            entityManager.persist(participacionChat);
        }

        return "chatDetalle"; // Este es el nombre de la vista para mostrar el detalle del chat
    }
}
