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

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import es.ucm.fdi.iw.AppConfig;
import es.ucm.fdi.iw.LocalData;

import es.ucm.fdi.iw.model.Evento;
import es.ucm.fdi.iw.model.Seccion;
import es.ucm.fdi.iw.model.User;
import es.ucm.fdi.iw.model.User.Role;
import es.ucm.fdi.iw.model.Transferable;
import java.util.stream.Collectors;
import java.util.Map;

import java.io.File;

/**
 * Non-authenticated requests only.
 */
@Controller
public class RootController {

    private final AuthenticationManager authenticationManagerBean;

    private final AppConfig appConfig;

    @Autowired
	private PasswordEncoder passwordEncoder;

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

    public String encodePassword(String rawPassword) {
		return passwordEncoder.encode(rawPassword);
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
        user.setPassword(encodePassword(password)); // Sustituye esto con la encriptación de contraseña
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
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime fechaInicio, // necesito
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

        int dineroDisponible = user.getDineroDisponible();
        int parteEntera = dineroDisponible / 100;
        int parteDecimal = dineroDisponible % 100;
        if(parteDecimal < 10) {
            String parteDecimalString = String.valueOf(parteDecimal);
            parteDecimalString = "0" + parteDecimalString;
            model.addAttribute("parteEntera", parteEntera);
            model.addAttribute("parteDecimal", parteDecimalString);
        }
        else{
            model.addAttribute("parteEntera", parteEntera);
            model.addAttribute("parteDecimal", parteDecimal);
        }

        return "ingresar";
    }

    @GetMapping("/cartera/retirar")
    public String retirar(Model model, HttpSession session) {
        User user = (User) session.getAttribute("u");

        int dineroDisponible = user.getDineroDisponible();
        model.addAttribute("dinero", dineroDisponible);
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

    @GetMapping("/perfil")
    public String perfil(Model model) {
        return "user";
    }
    

    @Transactional
    @ResponseBody
    @PostMapping("/cartera/ingresarDinero")
    public ResponseEntity<JsonNode> ingresarDinero(@RequestBody JsonNode json, HttpSession session) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        User user = entityManager.find(User.class, 
            ((User) session.getAttribute("u")).getId());

        int cantEntera = json.get("entera").asInt();
        int cantDecimal = json.get("decimal").asInt(); 
        int total = (cantEntera * 100) + cantDecimal;
        if(total < 300 || total > 150000){
            response.put("mensaje", "La cantidad a retirar debe estar entre 3 y 1500 euros: " + total);
            return ResponseEntity.badRequest().body(response);
        } 
        user.setDineroDisponible(user.getDineroDisponible() + total); 
        session.setAttribute("u", user);

        response.put("mensaje", "Dinero ingresado correctamente: " + total);
        return ResponseEntity.ok(response);
    }

    @Transactional
    @ResponseBody
    @PostMapping("/cartera/retirarDinero")
    public ResponseEntity<JsonNode> retirarDinero(@RequestBody JsonNode json, HttpSession session) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        User user = entityManager.find(User.class, 
            ((User) session.getAttribute("u")).getId());

        int cantEntera = json.get("entera").asInt();
        int cantDecimal = json.get("decimal").asInt(); 
        int total = (cantEntera * 100) + cantDecimal; 

        if(total > user.getDineroDisponible()) {
            response.put("mensaje", "No tienes suficiente dinero disponible para retirar: " + total);
            return ResponseEntity.badRequest().body(response);
        }
        else if(total < 500 || total > 100000){
            response.put("mensaje", "La cantidad a retirar debe estar entre 5 y 1000 euros: " + total);
            return ResponseEntity.badRequest().body(response);
        }
        user.setDineroDisponible(user.getDineroDisponible() - total); 
        session.setAttribute("u", user);

        response.put("mensaje", "Dinero retirado correctamente: " + total);
        return ResponseEntity.ok(response);
    }
}
