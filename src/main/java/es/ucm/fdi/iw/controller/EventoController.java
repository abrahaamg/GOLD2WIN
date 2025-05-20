package es.ucm.fdi.iw.controller;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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

import es.ucm.fdi.iw.model.Apuesta;

import es.ucm.fdi.iw.model.Evento;
import es.ucm.fdi.iw.model.FormulaApuesta;
import es.ucm.fdi.iw.model.Resultado;
import es.ucm.fdi.iw.model.User;
import es.ucm.fdi.iw.model.Variable;
import es.ucm.fdi.iw.model.Transferable;
import java.util.stream.Collectors;

import java.util.Map;

@Controller
@RequestMapping("evento")
public class EventoController {
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

    @PostMapping("/apostar")
    @Transactional
    @ResponseBody
    public String procesarApuesta(
            @RequestBody JsonNode o, HttpSession session) throws JsonProcessingException {

        long idFormula = o.get("idFormula").asLong();
        boolean decision = o.get("decision").asBoolean();
        int cantidad = o.get("cantidad").intValue(); // en centimos

        FormulaApuesta formula = entityManager.find(FormulaApuesta.class, idFormula);
        long userId = ((User) session.getAttribute("u")).getId();
        User u = entityManager.find(User.class, userId);

        // Comprobamos que los datos sean validos
        if (formula == null)
            return "Id invalido";

        if (formula.getEvento().isCancelado()) {
            return "Evento cancelado";
        }

        if (formula.getEvento().isCancelado()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento cancelado");
        }

        if (formula.getEvento().getFechaCierre().isBefore(OffsetDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento cerrado para apuestas");
        }

        if (cantidad <= 0)
            return "Cantidad no válida";

        if (cantidad > u.getDineroDisponible())
            return "saldo insuficiente";

        // Una vez las verificaciones hechas procedemos a crear la apuesta
        Apuesta nuevaApuesta = new Apuesta();
        nuevaApuesta.setCantidad(cantidad);
        nuevaApuesta.setAFavor(decision);
        nuevaApuesta.setApostador(u);
        nuevaApuesta.setFormulaApuesta(formula);
        nuevaApuesta.setFechaCreacion(OffsetDateTime.now());

        u.setDineroRetenido(u.getDineroRetenido() + cantidad);
        u.setDineroDisponible(u.getDineroDisponible() - cantidad);

        if (decision)
            formula.setDineroAfavor(formula.getDineroAfavor() + cantidad);
        else
            formula.setDineroEnContra(formula.getDineroEnContra() + cantidad);

        entityManager.persist(u);
        entityManager.persist(formula);
        entityManager.persist(nuevaApuesta);

        entityManager.flush();
        session.setAttribute("u", u);

        Map<String, Object> mensajeDinero = new HashMap<>();
        mensajeDinero.put("tipoEvento", "actualizarDinero");
        mensajeDinero.put("dineroDisponible", u.getDineroDisponible());
        mensajeDinero.put("dineroRetenido", u.getDineroRetenido());

        Map<String, Object> mensajeCuota = new HashMap<>();
        mensajeCuota.put("tipoEvento", "cambioCuota");
        mensajeCuota.put("cuotaDesfavorable", formula.calcularCuota(false));
        mensajeCuota.put("cuotaFavorable", formula.calcularCuota(true));
        mensajeCuota.put("idFormula", formula.getId());

        ObjectMapper mapper = new ObjectMapper();
        String jsonDinero;
        String jsonCuota;

        try {
            jsonDinero = mapper.writeValueAsString(mensajeDinero);
            jsonCuota = mapper.writeValueAsString(mensajeCuota);
            messagingTemplate.convertAndSend("/user/" + u.getUsername() + "/queue/updates", jsonDinero);
            messagingTemplate.convertAndSend("/topic/chats/" + formula.getEvento().getId() , jsonCuota);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return "OK";
    }

    @PostMapping(path = "/{id}/crearFormula" , produces = "application/json")
    @Transactional
    @ResponseBody
    public Map<String, Object> crearFormula(
            @PathVariable long id,
            @RequestBody JsonNode o, HttpSession session) throws JsonProcessingException {

        Map<String, Object> response = new HashMap<>();
        String titulo = o.get("titulo").asText();
        String formula = o.get("formula").asText();
        int cantidad = o.get("cantidad").asInt(); // recibo el dinero en centimos
        boolean tipoApuesta = o.get("tipoApuesta").asBoolean();

        Evento evento = entityManager.find(Evento.class, id);
        long userId = ((User) session.getAttribute("u")).getId();
        User u = entityManager.find(User.class, userId);

        // Comprobamos que los datos sean validos
        if (evento == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");

        if (evento.isCancelado()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento cancelado");
        }

        if (evento.getFechaCierre().isBefore(OffsetDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento cerrado para apuestas");
        }

        if (cantidad < 0){
            response.put("status", "ERROR-CANTIDAD");
            return response;
        }

        if (cantidad > u.getDineroDisponible()){
            response.put("status", "ERROR-CANTIDAD");
            return response;
        }

        if (titulo.equals("")){
            response.put("status", "ERROR-TITULO");
            return response;
        }

        if (!FormulaApuesta.formulaValida(formula, evento)){
            response.put("status", "ERROR-FORMULA");
            return response;
        }

        FormulaApuesta nuevaFormula = new FormulaApuesta();
        nuevaFormula.setEvento(evento);
        nuevaFormula.setCreador(u);
        nuevaFormula.setFormula(formula);
        nuevaFormula.setNombre(titulo);
        if (tipoApuesta) {
            nuevaFormula.setDineroAfavor(cantidad);
            nuevaFormula.setDineroEnContra(0);
        } else {
            nuevaFormula.setDineroAfavor(0);
            nuevaFormula.setDineroEnContra(cantidad);
        }
        nuevaFormula.setFechaCreacion(OffsetDateTime.now());
        nuevaFormula.setResultado(Resultado.INDETERMINADO);

        Apuesta nuevaApuesta = new Apuesta();
        nuevaApuesta.setCantidad(cantidad);
        nuevaApuesta.setAFavor(tipoApuesta);
        nuevaApuesta.setApostador(u);
        nuevaApuesta.setFormulaApuesta(nuevaFormula);
        nuevaApuesta.setFechaCreacion(OffsetDateTime.now());

        u.setDineroRetenido(u.getDineroRetenido() + cantidad);
        u.setDineroDisponible(u.getDineroDisponible() - cantidad);

        entityManager.persist(u);
        entityManager.persist(nuevaFormula);
        entityManager.persist(nuevaApuesta);

        entityManager.flush();
        session.setAttribute("u", u);

        Map<String, Object> mensaje = new HashMap<>();
        mensaje.put("tipoEvento", "actualizarDinero");
        mensaje.put("dineroDisponible", u.getDineroDisponible());
        mensaje.put("dineroRetenido", u.getDineroRetenido());
        ObjectMapper mapper = new ObjectMapper();
        String json;

        try {
            json = mapper.writeValueAsString(mensaje);
            messagingTemplate.convertAndSend("/user/" + u.getUsername() + "/queue/updates", json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        response.put("status", "OK");
        response.put("formula",nuevaFormula.toTransfer());
        
        return response;
    }

    @GetMapping(path = "/{id}/apostar/buscar", produces = "application/json")
    @Transactional
    @ResponseBody
    public Map<String, Object> buscarApuestas(
            @PathVariable long id,
            @RequestParam String busqueda,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime fechaInicio,
            @RequestParam int offset) {

        boolean hayMasFormulas = false;
        Evento evento = entityManager.find(Evento.class, id);

        if (evento == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");
        }

        if (evento.isCancelado()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento cancelado");
        }

        if (evento.getFechaCierre().isBefore(OffsetDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento cerrado para apuestas");
        }

        String queryEventos = "SELECT e FROM FormulaApuesta e WHERE e.fechaCreacion < :inicio AND e.evento.id = :id AND ((LOWER(e.nombre) LIKE LOWER(:busqueda)) OR (LOWER(e.formula) LIKE LOWER(:busqueda))) ORDER BY e.fechaCreacion ASC, e.id ASC";
        TypedQuery<FormulaApuesta> query = entityManager.createQuery(queryEventos, FormulaApuesta.class);

        query.setParameter("id", id);
        query.setParameter("busqueda", "%" + busqueda + "%");
        query.setParameter("inicio", fechaInicio);
        query.setMaxResults(11);
        query.setFirstResult(offset);

        List<FormulaApuesta> formulas = query.getResultList();

        if (formulas.size() == 11) {
            hayMasFormulas = true;
            formulas.remove(10);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("formulas", formulas.stream().map(Transferable::toTransfer).collect(Collectors.toList()));
        response.put("hayMasFormulas", hayMasFormulas);

        return response;
    }

    @GetMapping(path = "/{id}/apostar/cargarMas", produces = "application/json")
    @Transactional
    @ResponseBody
    public Map<String, Object> cargarApuestas(
            @PathVariable long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime fechaInicio, // necesito
                                                                                                          // indicar el
                                                                                                          // formato en
                                                                                                          // que viene
                                                                                                          // la
                                                                                                          // fecha
            @RequestParam int offset) {

        Evento evento = entityManager.find(Evento.class, id);
        TypedQuery<FormulaApuesta> query;
        String queryEventos = "SELECT e FROM FormulaApuesta e WHERE e.fechaCreacion < :inicio AND e.evento.id = :id ORDER BY e.fechaCreacion ASC, e.id ASC";
        boolean hayMasFormulas = false;

        if (evento == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");

        query = entityManager.createQuery(queryEventos, FormulaApuesta.class);
        query.setParameter("id", id);
        query.setParameter("inicio", fechaInicio);
        query.setMaxResults(11);
        query.setFirstResult(offset);
        List<FormulaApuesta> formulas = query.getResultList();

        if (formulas.size() == 11) {
            hayMasFormulas = true;
            formulas.remove(10);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("formulas", formulas.stream().map(Transferable::toTransfer).collect(Collectors.toList()));
        response.put("hayMasFormulas", hayMasFormulas);

        return response;
    }

    @GetMapping("{id}/apostar")
    public String apostar(@PathVariable long id, Model model, HttpSession session) throws JsonProcessingException {
        Evento eventoSel = entityManager.find(Evento.class, id);

        if (eventoSel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");
        }

        if (eventoSel.isCancelado()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento cancelado");
        }

        if (eventoSel.getFechaCierre().isBefore(OffsetDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento cerrado para apuestas");
        }

        Map<String, Object> informacionEvento = new HashMap<>();
        informacionEvento.put("idEvento", eventoSel.getId());
        informacionEvento.put("nombreEvento", eventoSel.getNombre());

        model.addAttribute("evento",informacionEvento);

        return "crearApuesta";
    }

    @GetMapping(path = "{id}/getVariables", produces = "application/json")
    @ResponseBody
    public Map<String, Object> getVariables(@PathVariable long id, Model model, HttpSession session) {
        Evento eventoSel = entityManager.find(Evento.class, id);
        Map<String, Object> response = new HashMap<>();

        if (eventoSel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");
        }
        
        response.put("variables", eventoSel.getVariables().stream().map(Variable::getNombre).collect(Collectors.toList()));

        return response;
    }
}
