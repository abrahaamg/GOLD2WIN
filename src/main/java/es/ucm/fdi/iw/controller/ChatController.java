package es.ucm.fdi.iw.controller;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import es.ucm.fdi.iw.model.Chat;
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
        
        return response; // Este es el nombre de la vista para mostrar los chats
    }

    // Este método es para ver un chat específico de un evento
    @GetMapping("/{chatId}")
    @Transactional
    public String verChat(@PathVariable long chatId, Model model, HttpSession session) {
        // Verificar si el usuario está logueado
        User user = (User) session.getAttribute("u");

        if (user == null) {
            return "redirect:/login"; // Si no está logueado, redirigimos al login
        }

        // Obtener el chat correspondiente al chatId
        Chat chat = entityManager.find(Chat.class, chatId);

        // Agregar el chat al modelo
        model.addAttribute("chat", chat);

        // Obtener los mensajes asociados a ese chat
        List<Mensaje> mensajes = entityManager.createNamedQuery("Mensaje.findByChat", Mensaje.class)
                .setParameter("chatId", chatId)
                .getResultList();

        // Agregar los mensajes al modelo
        model.addAttribute("mensajes", mensajes);

        // Devolver la vista con los detalles del chat
        return "chatDetalle"; // Este es el nombre de la vista para mostrar el detalle del chat
    }
}
