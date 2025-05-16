package es.ucm.fdi.iw.controller;

import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import es.ucm.fdi.iw.AppConfig;
import es.ucm.fdi.iw.LocalData;

import es.ucm.fdi.iw.model.User;

@Controller
@RequestMapping("cartera")
public class CarteraController {
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

    CarteraController(AdminController adminController, AppConfig appConfig,
            AuthenticationManager authenticationManagerBean) {
        this.adminController = adminController;
        this.appConfig = appConfig;
        this.authenticationManagerBean = authenticationManagerBean;
    }

    //Pagina inicial de la cartera
    @GetMapping("/ingresar")
    public String ingresar(Model model, HttpSession session) {
        User user = (User) session.getAttribute("u");

        int dineroDisponible = user.getDineroDisponible();
        int parteEntera = dineroDisponible / 100;
        int parteDecimal = dineroDisponible % 100;
        if (parteDecimal < 10) {
            String parteDecimalString = String.valueOf(parteDecimal);
            parteDecimalString = "0" + parteDecimalString;
            model.addAttribute("parteEntera", parteEntera);
            model.addAttribute("parteDecimal", parteDecimalString);
        } else {
            model.addAttribute("parteEntera", parteEntera);
            model.addAttribute("parteDecimal", parteDecimal);
        }

        return "ingresar";
    }

    //pagina tras pulsar retirar
    @GetMapping("/retirar")
    public String retirar(Model model, HttpSession session) {
        User user = (User) session.getAttribute("u");

        int dineroDisponible = user.getDineroDisponible();
        model.addAttribute("dinero", dineroDisponible);
        return "retirar";
    }

    //Pagina tras pulsar ingresar
    @GetMapping("/ingreso")
    public String ingreso(Model model) {
        return "ingreso";
    }

    @GetMapping("/ingresar/paypal")
    public String paypal(Model model) {
        return "paypal";
    }

    @GetMapping("/ingresar/tarjeta")
    public String tarjeta(Model model) {
        return "tarjeta";
    }

    @Transactional
    @ResponseBody
    @PostMapping("/ingresarDinero")
    public ResponseEntity<JsonNode> ingresarDinero(@RequestBody JsonNode json, HttpSession session) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        User user = entityManager.find(User.class, ((User)session.getAttribute("u")).getId());

        int cantEntera = json.get("entera").asInt();
        int cantDecimal = json.get("decimal").asInt();
        int total = (cantEntera * 100) + cantDecimal;

        if(total == 0){
            session.setAttribute("u", user); //actualizo el usuario para que cuando recargue la pagina siga apareciendo el dinero
        }

        if (total < 300 || total > 150000) {
            response.put("mensaje", "La cantidad a ingresar debe estar entre 3 y 1500 euros: " + total);
            return ResponseEntity.badRequest().body(response);
        }

        user.setDineroDisponible(user.getDineroDisponible() + total);
        session.setAttribute("u", user);

        response.put("mensaje", "Dinero ingresado correctamente: " + total);
        return ResponseEntity.ok(response);
    }

    @Transactional
    @ResponseBody
    @PostMapping("/retirarDinero")
    public ResponseEntity<JsonNode> retirarDinero(@RequestBody JsonNode json, HttpSession session) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        User user = entityManager.find(User.class, ((User)session.getAttribute("u")).getId());

        int cantEntera = json.get("entera").asInt();
        int cantDecimal = json.get("decimal").asInt();
        int total = (cantEntera * 100) + cantDecimal;

        if (total > user.getDineroDisponible()) {
            response.put("mensaje", "No tienes suficiente dinero disponible para retirar: " + total);
            return ResponseEntity.badRequest().body(response);
        } else if (total < 500 || total > 100000) {
            response.put("mensaje", "La cantidad a retirar debe estar entre 5 y 1000 euros: " + total);
            return ResponseEntity.badRequest().body(response);
        }
        user.setDineroDisponible(user.getDineroDisponible() - total);
        session.setAttribute("u", user);

        response.put("mensaje", "Dinero retirado correctamente: " + total);
        return ResponseEntity.ok(response);
    }
}
