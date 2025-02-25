package es.ucm.fdi.iw.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


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

    @GetMapping("/verificarEvento")
    public String verificarEvento(Model model){
        return "verificarEvento";
    }

    @GetMapping("/tablaReportes")
    public String tablaReportes(Model model){
        return "tablaReportes";
    }

    @GetMapping("/reporteConcreto")
    public String reporteConcreto(Model model){
        return "reporteConcreto";
    }
}
