package es.ucm.fdi.iw.controller;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;

import es.ucm.fdi.iw.model.Apuesta;
import es.ucm.fdi.iw.model.Transferable;
import es.ucm.fdi.iw.model.User;

//Controlador para la zona del historial
@Controller
@RequestMapping("misApuestas")
public class HistorialController {

    @Autowired
    private EntityManager entityManager;

    @ModelAttribute
    public void populateModel(HttpSession session, Model model) {
        for (String name : new String[] { "u", "url", "ws", "topics" }) {
            model.addAttribute(name, session.getAttribute(name));
        }
    }

    @GetMapping("/")
    public String misApuestas(Model model) {
        return "misApuestas";
    }

    @GetMapping(path = "/cargarMas", produces = "application/json")
    @Transactional
    @ResponseBody
    public Map<String, Object> cargarApuestas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime fechaInicio,
            @RequestParam int offset,
            @RequestParam String apartado,
            HttpSession session) throws JsonProcessingException {

        TypedQuery<Apuesta> query;
        boolean hayMasApuestas = false;
        long userId = ((User) session.getAttribute("u")).getId();

        if(apartado.equals("pendientes"))
            query = entityManager.createNamedQuery("Apuesta.getPendienteAfterDate", Apuesta.class);
        else if(apartado.equals("determinadas"))
            query = entityManager.createNamedQuery("Apuesta.getDeterminadaAfterDate", Apuesta.class);
        else
            query = entityManager.createNamedQuery("Apuesta.getAllAfterDate", Apuesta.class);
        
        query.setParameter("id", userId);
        query.setParameter("inicio", fechaInicio);
        query.setMaxResults(11);
        query.setFirstResult(offset);
        List<Apuesta> apuestas = query.getResultList();

        if (apuestas.size() == 11) {
            hayMasApuestas = true;
            apuestas.remove(10);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("apuestas", apuestas.stream().map(Transferable::toTransfer).collect(Collectors.toList()));
        response.put("hayMasApuestas", hayMasApuestas);

        return response;
    }
}