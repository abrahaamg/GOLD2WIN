package es.ucm.fdi.iw.controller;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.fasterxml.jackson.databind.JsonNode;

import es.ucm.fdi.iw.AppConfig;
import es.ucm.fdi.iw.LocalData;
import es.ucm.fdi.iw.model.Apuesta;

import es.ucm.fdi.iw.model.Evento;
import es.ucm.fdi.iw.model.FormulaApuesta;
import es.ucm.fdi.iw.model.Seccion;
import es.ucm.fdi.iw.model.User;
import es.ucm.fdi.iw.model.Variable;
import es.ucm.fdi.iw.model.User.Role;
import es.ucm.fdi.iw.model.VariableSeccion;
import es.ucm.fdi.iw.model.Transferable;
import java.util.stream.Collectors;
import java.util.Map;

import java.io.File;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Non-authenticated requests only.
 */
@Controller
public class RootController {

    private final AuthenticationManager authenticationManagerBean;

    private final AppConfig appConfig;

    private final AdminController adminController;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private LocalData localData;

    private static final Logger log = LogManager.getLogger(RootController.class);

    @ModelAttribute
    public void populateModel(HttpSession session, Model model) {
        for (String name : new String[] { "u", "url", "ws", "topics" }) {
            model.addAttribute(name, session.getAttribute(name));
        }
    }

    RootController(AdminController adminController, AppConfig appConfig,
            AuthenticationManager authenticationManagerBean) {
        this.adminController = adminController;
        this.appConfig = appConfig;
        this.authenticationManagerBean = authenticationManagerBean;
    }

    @PostMapping("/register")
    @Transactional
    @ResponseBody
    public Map<String, Object> handleRegister(@RequestBody JsonNode o, Model model) {
        Map<String, Object> response = new HashMap<>();

        String username = o.get("username").asText();
        String password = o.get("password").asText();
        String email = o.get("email").asText();
        String firstName = o.get("firstName").asText();
        String lastName = o.get("lastName").asText();

        // Verificar si el nombre de usuario ya existe
        String queryUsername = "SELECT COUNT(u) FROM User u WHERE u.username = :username";
        Long countUsername = entityManager.createQuery(queryUsername, Long.class)
                .setParameter("username", username)
                .getSingleResult();

        if (countUsername > 0) {
            response.put("success", false);
            response.put("error", "username");
            return response;
        }

        // Verificar si el correo electrónico ya existe
        String queryEmail = "SELECT COUNT(u) FROM User u WHERE u.email = :email";
        Long countEmail = entityManager.createQuery(queryEmail, Long.class)
                .setParameter("email", email)
                .getSingleResult();

        if (countEmail > 0) {
            response.put("success", false);
            response.put("error", "email");
            return response;
        }

        User user = new User();

        user.setUsername(username);
        user.setPassword(password); // Sustituye esto con la encriptación de contraseña
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEnabled(true); // Inicialmente deshabilitado
        user.setRoles("USER"); // Rol por defecto
        user.setDineroDisponible(0); // Inicialmente sin dinero disponible
        user.setDineroRetenido(0); // Inicialmente sin dinero retenido

        entityManager.persist(user);
        entityManager.flush();

        response.put("success", true);
        return response;
    }

    @GetMapping("/login")
    public String login(Model model) {
        return "login";
    }

    @GetMapping("/register")
    public String register(Model model) {
        return "register";
    }

    @GetMapping("/")
    public String index(Model model) {
        // obtengo las secciones
        List<Seccion> secciones = entityManager.createNamedQuery("Seccion.getAll",Seccion.class).getResultList();

        // añado los eventos y las secciones al modelo
        model.addAttribute("secciones", secciones);
        model.addAttribute("selectedSeccion", -1);

        return "index";
    }

    @GetMapping(path = "/seccion/buscar", produces = "application/json")
    @Transactional
    @ResponseBody
    public Map<String, Object> buscarEventos(
            @RequestParam long seccionId,
            @RequestParam String busqueda,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio, // necesito
                                                                                                         // indicar el
                                                                                                         // formato en
                                                                                                         // que viene la
                                                                                                         // fecha
            @RequestParam int offset) {

        boolean hayMasEventos = false;
        TypedQuery<Evento> query;
        String nombre;
        List<String> etiquetas;
        Seccion seccion;

        //procesamos la busqueda
        etiquetas = List.of(busqueda.split(" ")).stream()
                .filter(palabra -> palabra.startsWith("[") && palabra.endsWith("]")).collect(Collectors.toList());
        nombre = List.of(busqueda.split(" ")).stream()
                .filter(palabra -> !(palabra.startsWith("[") && palabra.endsWith("]")))
                .collect(Collectors.joining(" "));

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

    @GetMapping(path = "/seccion/cargarMas", produces = "application/json")
    @Transactional
    @ResponseBody
    public Map<String, Object> cargarMasEventos(
            @RequestParam long seccionId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
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

    @GetMapping("/seccion/{id}")
    public String eventosSeccion(@PathVariable long id, Model model) {
        // obtengo las secciones
        List<Seccion> secciones = entityManager.createNamedQuery("Seccion.getAll",Seccion.class).getResultList();

        // añado las secciones al modelo
        model.addAttribute("secciones", secciones);
        model.addAttribute("selectedSeccion", id);

        return "index";
    }

    @GetMapping("/seccion/{id}/pic")
    public StreamingResponseBody getPic(@PathVariable long id) throws IOException {
        File f = localData.getFile("seccion", "" + id + ".jpg");
        InputStream in = new BufferedInputStream(f.exists() ? new FileInputStream(f) : RootController.defaultPic());
        return os -> FileCopyUtils.copy(in, os);
    }

    private static InputStream defaultPic() {
        return new BufferedInputStream(Objects.requireNonNull(
                UserController.class.getClassLoader().getResourceAsStream(
                        "static/img/default-pic.jpg")));
    }

    @GetMapping("/misApuestas")
    public String misApuestas(Model model) {
        return "misApuestas";
    }

    @GetMapping("/crearApuesta")
    public String crearApuesta(Model model) {
        return "crearApuesta";
    }

    @GetMapping("/admin")
    public String admin(Model model) {
        return "admin";
    }

    @GetMapping("/cartera/ingresar")
    public String ingresar(Model model, HttpSession session) {
        User user = (User) session.getAttribute("u");
        if (user == null || !user.hasRole(Role.USER)) {
            return "redirect:/login"; // Redirige si no es un usuario autenticado
        }
        return "ingresar";
    }

    @GetMapping("/cartera/retirar")
    public String retirar(Model model) {
        return "retirar";
    }

    @GetMapping("/cartera/ingreso")
    public String ingreso(Model model) {
        return "ingreso";
    }

    @GetMapping("/cartera/ingresar/paypal")
    public String paypal(Model model) {
        return "paypal";
    }

    @GetMapping("/cartera/ingresar/tarjeta")
    public String tarjeta(Model model) {
        return "tarjeta";
    }

    @GetMapping("/misApuestas/todas")
    public String todasMisApuestas(Model model) {
        // Obtener el username desde el contexto de seguridad
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        // Buscar el usuario por su username
        String queryUser = "SELECT u FROM User u WHERE u.username = :username";
        User user = entityManager.createQuery(queryUser, User.class)
                .setParameter("username", username)
                .getSingleResult();

        // Ya tienes el ID
        Long id = user.getId();

        // Buscar solo las apuestas del usuario actual
        String queryApuestas = "SELECT a FROM Apuesta a WHERE a.apostador.id = :id";
        List<Apuesta> apuestas = entityManager.createQuery(queryApuestas, Apuesta.class)
                .setParameter("id", id)
                .getResultList();

        model.addAttribute("apuestas", apuestas);
        return "misApuestas-todas";
    }

    @GetMapping("/misApuestas/determinadas")
    public String apuestasDeterminadas(Model model) {
        // Obtener el username desde el contexto de seguridad
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        // Buscar el usuario por su username
        String queryUser = "SELECT u FROM User u WHERE u.username = :username";
        User user = entityManager.createQuery(queryUser, User.class)
                .setParameter("username", username)
                .getSingleResult();

        // Ya tienes el ID
        Long id = user.getId();

        String queryDeterminadas = "SELECT a FROM Apuesta a WHERE a.formulaApuesta.resultado IN ('GANADO', 'PERDIDO') AND a.apostador.id = :id";
        List<Apuesta> apuestasDeterminadas = entityManager.createQuery(queryDeterminadas, Apuesta.class)
                .setParameter("id", id)
                .getResultList();
        model.addAttribute("apuestasDeterminadas", apuestasDeterminadas);
        return "misApuestas-determinadas";
    }

    @GetMapping("/misApuestas/pendientes")
    public String apuestasPendientes(Model model) {
        // Obtener el username desde el contexto de seguridad
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        // Buscar el usuario por su username
        String queryUser = "SELECT u FROM User u WHERE u.username = :username";
        User user = entityManager.createQuery(queryUser, User.class)
                .setParameter("username", username)
                .getSingleResult();

        // Ya tienes el ID
        Long id = user.getId();

        String queryDeterminadas = "SELECT a FROM Apuesta a WHERE a.formulaApuesta.resultado = 'INDETERMINADO' AND a.apostador.id = :id";
        List<Apuesta> apuestasPendientes = entityManager.createQuery(queryDeterminadas, Apuesta.class)
                .setParameter("id", id)
                .getResultList();
        model.addAttribute("apuestasPendientes", apuestasPendientes);
        return "misApuestas-pendientes";
    }

    @GetMapping("/admin/usuarios")
    public String usuarios(Model model) {
        return "usuarios";
    }

    @GetMapping("/admin/usuarios/usuarioDetalles")
    public String usuarioDetalles(Model model) {
        return "usuarioDetalles";
    }

    @GetMapping("/admin/usuarios/transacciones")
    public String transacciones(Model model) {
        return "transacciones";
    }
}
