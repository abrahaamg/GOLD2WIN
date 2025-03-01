package es.ucm.fdi.iw.controller;

import javax.servlet.http.HttpSession;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import es.ucm.fdi.iw.model.User;
import es.ucm.fdi.iw.model.User.Role;


/**
 *  Non-authenticated requests only.
 */
@Controller
public class RootController {

	private static final Logger log = LogManager.getLogger(RootController.class);

	@GetMapping("/login")
    public String login(Model model) {
        return "login";
    }

	@GetMapping("/")
    public String index(Model model) {
        return "index";
    }

    @GetMapping("/misApuestas")
    public String misApuestas(Model model){
        return "misApuestas";
    }

    @GetMapping("/crearApuesta")
    public String crearApuesta(Model model){
        return "crearApuesta";
    }

    @GetMapping("/admin")
    public String admin(Model model){
        return "admin";
    }

    @GetMapping("/cartera/ingresar")
    public String ingresar(Model model, HttpSession session) {
        User user = (User) session.getAttribute("u");
        if (user == null || !user.hasRole(Role.USER)) {
            return "redirect:/login";  // Redirige si no es un usuario autenticado
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
    public String todasMisApuestas(Model model){
        return "misApuestas-todas";
    }

    @GetMapping("/misApuestas/determinadas")
    public String apuestasDeterminadas(Model model){
        return "misApuestas-determinadas";
    }

    @GetMapping("/misApuestas/pendientes")
    public String apuestasPendientes(Model model){
        return "misApuestas-pendientes";
    }
}
