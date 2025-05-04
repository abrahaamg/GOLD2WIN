package es.ucm.fdi.iw.controller;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


import es.ucm.fdi.iw.model.Evento;
import es.ucm.fdi.iw.model.Mensaje;
import es.ucm.fdi.iw.model.ParticipacionChat;
import es.ucm.fdi.iw.model.Transferable;
import es.ucm.fdi.iw.model.User;

@Controller
@RequestMapping("chats")
public class ChatController {

    private static final Logger log = LogManager.getLogger(UserController.class);

    @Autowired
    private EntityManager entityManager;

    @Autowired
	private SimpMessagingTemplate messagingTemplate;

    @ModelAttribute
	public void populateModel(HttpSession session, Model model) {
		for (String name : new String[] { "u", "url", "ws", "topics" }) {
			model.addAttribute(name, session.getAttribute(name));
		}
	}

    // Este método carga los eventos disponibles para los chats y los pasa al modelo
    @GetMapping("/")
    @Transactional
    public String chats(HttpSession session, Model model, @RequestParam(name = "eventoInicio", required = false) Long idEvento) {
        if(idEvento != null){
            User user = (User) session.getAttribute("u");
            Evento evento = entityManager.find(Evento.class, idEvento);

            model.addAttribute("eventoInicial", idEvento);

            if(evento == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");
            }

            if (user == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
            }

            boolean pertenece = !entityManager.createNamedQuery("User.estaEnChat", ParticipacionChat.class)
                .setParameter("user", user)
                .setParameter("evento", evento)
                .getResultList().isEmpty();

            if(!pertenece){
                ParticipacionChat participacionChat = new ParticipacionChat(user, evento, OffsetDateTime.now());
                entityManager.persist(participacionChat);
                entityManager.flush();
            }
        }

        return "chats";
    }

    @GetMapping(path = "/cargarChats", produces = "application/json")
    @ResponseBody
    public Map<String, Object> cargarChats(HttpSession session) {
        User user = entityManager.find(User.class,((User) session.getAttribute("u")).getId());
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

    @GetMapping(path = "/cargarMensajes/{id}", produces = "application/json")
    @ResponseBody
    @Transactional
    public Map<String, Object> cargarMensajes(@PathVariable long id, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("u");
        Evento evento = entityManager.find(Evento.class, id);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
        }

        if(evento == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");
        }

        boolean pertenece = !entityManager.createNamedQuery("User.estaEnChat", ParticipacionChat.class)
                .setParameter("user", user)
                .setParameter("evento", evento)
                .getResultList().isEmpty();

        if(!pertenece)
           throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No perteneces a este chat");

        // Obtengo los mensajes del evento
        List<Mensaje.Transfer> mensajes = evento.getMensajes().stream()
            .map(Transferable::toTransfer)
            .sorted(Comparator.comparing(Mensaje.Transfer::getFecha)) // Ordenar por fecha
            .collect(Collectors.toList());

        response.put("mensajes", mensajes);

        //Marco que la ultima visita ha sido ahora
        ParticipacionChat participacionChat = entityManager.createNamedQuery("User.estaEnChat", ParticipacionChat.class)
                .setParameter("user", user)
                .setParameter("evento", evento)
                .getSingleResult();
            
        participacionChat.setUltimaVisita(OffsetDateTime.now());
        entityManager.merge(participacionChat);
        entityManager.flush();

        return response;
    }

    @PostMapping("/mandarMensaje/{id}")
	@ResponseBody
	@Transactional
	public String postMsg(@PathVariable long id,
			@RequestBody JsonNode o, Model model, HttpSession session)
			throws JsonProcessingException {
            
        Map<String, Object> response = new HashMap<>();
		String contenido = o.get("contenido").asText();
		Evento evento = entityManager.find(Evento.class, id);
		User sender = entityManager.find(
				User.class, ((User) session.getAttribute("u")).getId());

        //No debería ser necesario porque la ruta esta protegida pero por si acaso
        if (sender == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
        }

        if (evento == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");
        }

        boolean pertenece = !entityManager.createNamedQuery("User.estaEnChat", ParticipacionChat.class)
                .setParameter("user", sender)
                .setParameter("evento", evento)
                .getResultList().isEmpty();

        if (!pertenece) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para enviar mensajes a este chat");
        }

        if(contenido.equals("")){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El mensaje no puede estar vacío");
        }

		// construye mensaje, lo guarda en BD
		Mensaje m = new Mensaje();
		m.setContenido(contenido);
		m.setRemitente(sender);
		m.setEnabled(true);
        m.setFechaEnvio(OffsetDateTime.now());
        m.setEvento(evento);

		entityManager.persist(m);
		entityManager.flush();

        ObjectMapper mapper = new ObjectMapper();
        response.put("mensaje", m.toTransfer());
        response.put("tipoEvento", "nuevoMensaje");

        log.info("llega al json");
		String json = mapper.writeValueAsString(response);

		log.info("Sending a message to {} with contents '{}'", id, json);

		messagingTemplate.convertAndSend("/topic/chats/" + id , json);

		return "{\"result\": \"message sent.\"}"; //construye un json de manera manual (por eso lo puede recibir el go)
	}

    @PostMapping("/notificar/{id}")
    @ResponseBody
    @Transactional
    public Map<String, Object> notificarVista(@PathVariable long id, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("u");
        Evento evento = entityManager.find(Evento.class, id);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
        }

        if(evento == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");
        }

        boolean pertenece = !entityManager.createNamedQuery("User.estaEnChat", ParticipacionChat.class)
                .setParameter("user", user)
                .setParameter("evento", evento)
                .getResultList().isEmpty();

        if(!pertenece)
           throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No perteneces a este chat");

        ParticipacionChat participacionChat = entityManager.createNamedQuery("User.estaEnChat", ParticipacionChat.class)
                .setParameter("user", user)
                .setParameter("evento", evento)
                .getSingleResult();
            
        participacionChat.setUltimaVisita(OffsetDateTime.now());
        entityManager.merge(participacionChat);
        entityManager.flush();

        response.put("status", "ok");

        return response;
    }
}
