package es.ucm.fdi.iw.controller;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import es.ucm.fdi.iw.LocalData;

import es.ucm.fdi.iw.model.Evento;
import es.ucm.fdi.iw.model.Seccion;
import es.ucm.fdi.iw.model.Transferable;
import java.util.stream.Collectors;
import java.util.Map;

import java.io.File;


@Controller()
@RequestMapping("seccion")
public class SeccionController {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private LocalData localData;

    @ModelAttribute
    public void populateModel(HttpSession session, Model model) {
        for (String name : new String[] { "u", "url", "ws", "topics" }) {
            model.addAttribute(name, session.getAttribute(name));
        }
    }

    // Ruta para ver todos los eventos de una sección
    @GetMapping("/{id}")
    public String eventosSeccion(@PathVariable long id, Model model) {
        // obtengo las secciones
        List<Seccion> secciones = entityManager.createNamedQuery("Seccion.getAll", Seccion.class).getResultList();

        // añado las secciones al modelo
        model.addAttribute("secciones", secciones);
        model.addAttribute("selectedSeccion", id);

        return "index";
    }

    /* Permite cargar más eventos de la sección seleccionada. 
     * Se indica el offset (elementos que ya tiene cargados el usuario) para poder entregarle los siguientes.
     * También se indica la fecha de la primera carga por si se han añadido nuevos eventos que no se descuadre el offset.
    */
    @GetMapping(path = "/cargarMas", produces = "application/json")
    @Transactional
    @ResponseBody
    public Map<String, Object> cargarMasEventos(
            @RequestParam long seccionId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime fechaInicio,
            @RequestParam int offset) {
        boolean hayMasEventos = false;

        Seccion seccion = entityManager.find(Seccion.class, seccionId);
        TypedQuery<Evento> query;

        if (seccion != null && seccion.isEnabled()) {
            query = entityManager.createNamedQuery("Evento.getAllAfterDateInSeccion", Evento.class);
            query.setParameter("seccion", seccionId);
        } else {
            query = entityManager.createNamedQuery("Evento.getAllAfterDate", Evento.class);
        }

        query.setParameter("inicio", fechaInicio);
        query.setMaxResults(11);
        query.setFirstResult(offset);
        List<Evento> eventos = query.getResultList();

        if (eventos.size() == 11) {
            hayMasEventos = true;
            eventos.remove(10);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("eventos", eventos.stream().map(Transferable::toTransfer).collect(Collectors.toList()));
        response.put("hayMasEventos", hayMasEventos);

        return response;
    }

    /*
     * Igual que cargar más pero adicionalmente permite filtrar por nombre 
     */
    @GetMapping(path = "/buscar", produces = "application/json")
    @Transactional
    @ResponseBody
    public Map<String, Object> buscarEventos(
            @RequestParam long seccionId,
            @RequestParam String busqueda,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime fechaInicio, // necesito
                                                                                                          // indicar el
                                                                                                          // formato en
                                                                                                          // que viene
                                                                                                          // la
                                                                                                          // fecha
            @RequestParam int offset) {

        boolean hayMasEventos = false;
        TypedQuery<Evento> query;
        String nombre = busqueda;
        Seccion seccion;

        seccion = entityManager.find(Seccion.class, seccionId);

        if (seccion != null && seccion.isEnabled()) {
            query = entityManager.createNamedQuery("Evento.getBusquedaInSeccion", Evento.class);
            query.setParameter("seccionId", seccionId);
        } else {
            query = entityManager.createNamedQuery("Evento.getBusqueda", Evento.class);
        }

        query.setParameter("nombre", "%" + nombre + "%");
        query.setParameter("inicio", fechaInicio);
        query.setMaxResults(11);
        query.setFirstResult(offset);

        List<Evento> eventos = query.getResultList();

        if (eventos.size() == 11) {
            hayMasEventos = true;
            eventos.remove(10);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("eventos", eventos.stream().map(Transferable::toTransfer).collect(Collectors.toList()));
        response.put("hayMasEventos", hayMasEventos);

        return response;
    }

    //Ruta para cargar la imagen de una sección
    @GetMapping("/{id}/pic")
    public StreamingResponseBody getPic(@PathVariable long id) throws IOException {
        File f = localData.getFile("seccion", "" + id + ".jpg");
        
        if (!f.exists()) {
            f = localData.getFile("seccion", "" + id + ".png");
        }

        InputStream in = new BufferedInputStream(f.exists() ? new FileInputStream(f) : SeccionController.defaultPic());
        return os -> FileCopyUtils.copy(in, os);
    }

    // Imagen por defecto si una sección no tiene imagen
    private static InputStream defaultPic() {
        return new BufferedInputStream(Objects.requireNonNull(
                UserController.class.getClassLoader().getResourceAsStream(
                        "static/img/default-pic.jpg")));
    }
}
