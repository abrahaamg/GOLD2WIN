package es.ucm.fdi.iw.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;

import com.ezylang.evalex.*;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

import com.ezylang.evalex.data.EvaluationValue;
import com.ezylang.evalex.data.EvaluationValue.DataType;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;

import es.ucm.fdi.iw.model.Apuesta;
import es.ucm.fdi.iw.model.Evento;
import es.ucm.fdi.iw.model.FormulaApuesta;
import es.ucm.fdi.iw.model.Resultado;
import es.ucm.fdi.iw.model.Seccion;
import es.ucm.fdi.iw.model.User;
import es.ucm.fdi.iw.model.Variable;
import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

/**
 * Site administration.
 *
 * Access to this end-point is authenticated - see SecurityConfig
 */
@Controller
@RequestMapping("admin")
public class AdminController {

    @Autowired
    private EntityManager entityManager;

    private static final Logger log = LogManager.getLogger(AdminController.class);

    @ModelAttribute
    public void populateModel(HttpSession session, Model model) {
        for (String name : new String[] { "u", "url", "ws", "topics" }) {
            model.addAttribute(name, session.getAttribute(name));
        }
    }

    @GetMapping("/")
    public String index(Model model) {
        return "admin";
    }

    @GetMapping("/reportes")
    public String tablaReportes(Model model) {
        return "reportes";
    }

    @GetMapping("/reporteConcreto")
    public String reporteConcreto(Model model) {
        return "reporteConcreto";
    }

    @GetMapping("/verificarEvento")
    public String verificarEvento(Model model) {
        return "verificarEvento";
    }

    @GetMapping("/eventos/determinar/{id}")
    public String verificarEvento(@PathVariable long id, Model model) {
        Evento evento = entityManager.find(Evento.class, id);

        if (evento == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");
        }

        if (evento.isCancelado()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El evento ya ha sido cancelado");
        }

        if (!evento.getFechaCierre().isBefore(java.time.LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El evento aun no se ha producido");
        }

        if (evento.isDeterminado()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El evento ya ha sido determinado");
        }

        model.addAttribute("eventoSel", evento);

        return "determinarEvento";
    }

    @PostMapping(path = "/eventos/determinar/{id}", produces = "application/json")
    @ResponseBody
    @Transactional
    public Map<String, Object> determinarEvnetoControl(@PathVariable long id, @RequestBody JsonNode o, Model model)
            throws JsonProcessingException {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> variables = new HashMap<>();
        Set<String> faltantes = new HashSet<>();

        Evento evento = entityManager.find(Evento.class, id);

        if (evento == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");
        }

        if (evento.isCancelado()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El evento ya ha sido cancelado");
        }

        if (!evento.getFechaCierre().isBefore(java.time.LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El evento aun no se ha producido");
        }

        if (evento.isDeterminado()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El evento ya ha sido determinado");
        }

        response.put("success", true);

        for (Variable variable : evento.getVariables()) {
            if (o.has(variable.getNombre())) {
                if (variable.isNumerico()) {
                    if (!o.get(variable.getNombre()).isNumber()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "La variable " + variable.getNombre() + " no es numerica");
                    }

                    variables.put(variable.getNombre(), o.get(variable.getNombre()).asDouble());
                } else {
                    if (!o.get(variable.getNombre()).isTextual()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "La variable " + variable.getNombre() + " no es de texto");
                    }

                    variables.put(variable.getNombre(), o.get(variable.getNombre()).asText());
                }
            } else { // falta una variable
                response.put("success", false);
                faltantes.add(variable.getNombre());
            }

            // Si faltan varialbes se devuelve un error
            if (((Boolean) response.get("success")) == false) {
                response.put("error", "faltantes");
                response.put("faltantes", faltantes);

                return response;
            }
        }

        determinarEvento(evento, variables);

        return response;
    }

    @GetMapping("/secciones")
    public String secciones(Model model) {
        // obtengo las secciones
        String querySecciones = "SELECT s FROM Seccion s WHERE s.enabled = true ORDER BY s.grupo ASC";
        List<Seccion> secciones = entityManager.createQuery(querySecciones).getResultList();

        model.addAttribute("secciones", secciones);

        return "secciones";
    }

    @GetMapping("/secciones/{id}/editar")
    public String editarSeccion(@PathVariable long id, Model model, HttpSession session) {
        Seccion target = entityManager.find(Seccion.class, id);
        String querySecciones = "SELECT s FROM Seccion s WHERE s.enabled = true ORDER BY s.grupo ASC";
        List<Seccion> secciones = entityManager.createQuery(querySecciones).getResultList();

        model.addAttribute("seccionEditable", target);
        model.addAttribute("secciones", secciones);

        return "editarSeccion";
    }

    @GetMapping("/secciones-crearSeccion")
    public String seccionesCrear(Model model) {
        // obtengo las secciones
        String querySecciones = "SELECT s FROM Seccion s WHERE s.enabled = true ORDER BY s.grupo ASC";
        List<Seccion> secciones = entityManager.createQuery(querySecciones).getResultList();

        model.addAttribute("secciones", secciones);

        return "secciones-crearSeccion";
    }

    @GetMapping("/eventos")
    public String eventos(Model model) {
        String queryEventos = "SELECT e FROM Evento e WHERE e.cancelado = false";
        List<Evento> eventos = entityManager.createQuery(queryEventos, Evento.class).getResultList();

        model.addAttribute("eventos", eventos);

        return "eventos";
    }

    // Logica para determinar evento
    // El evento tiene que haberse traido previamente de la base de datos y
    // verificado que no sea null
    private void determinarEvento(Evento evento, Map<String, Object> variables) {
        // Primero establezco el valor de las variables en la BD
        for (Variable variable : evento.getVariables()) {
            if (variable != null) {
                variable.setResolucion(variables.get(variable.getNombre()).toString());
                entityManager.persist(variable);
            }
        }

        // calculo si las diferentes formulas se han cumplido y reparto el dinero

        Map<String, Variable> variablesEvento = new HashMap<>();
        for (Variable variable : evento.getVariables()) {
            variablesEvento.put(variable.getNombre(), variable);
        }

        for (FormulaApuesta formula : evento.getFormulasApuestas()) {
            Resultado resultado = Resultado.INDETERMINADO;

            if (formula.getDineroAfavor() == 0 || formula.getDineroEnContra() == 0) { // si no ha apostado nadie a un
                                                                                      // lado no se puede calcular la
                                                                                      // cuota
                resultado = Resultado.ERROR;
            } else {
                try {
                    Expression expresion = new Expression(formula.getFormula());
                    String variablesNecesarias[] = expresion.getUndefinedVariables().toArray(new String[0]);

                    // Reemplazo las variables en la formula
                    for (String variableNecesaria : variablesNecesarias) {
                        if (variablesEvento.get(variableNecesaria).isNumerico()) {
                            expresion.with(variableNecesaria, (Double) variables.get(variableNecesaria));
                        } else {
                            expresion.with(variableNecesaria, (String) variables.get(variableNecesaria));
                        }
                    }

                    // Evaluo la expresion
                    EvaluationValue evaluacion = expresion.evaluate();
                    if (DataType.BOOLEAN == evaluacion.getDataType()) {
                        if (evaluacion.getBooleanValue()) {
                            resultado = Resultado.GANADO;
                        } else {
                            resultado = Resultado.PERDIDO;
                        }
                    } else {
                        resultado = Resultado.ERROR;
                    }
                } catch (Exception e) {
                    resultado = Resultado.ERROR;
                }
            }

            formula.setResultado(resultado);

            // En teoria solo es transaccional la parte de modificar dinero para no bloquear
            // mas cosas de las necesarias.
            for (Apuesta apuesta : formula.getApuestas()) {
                if (formula.getResultado() == Resultado.ERROR) {
                    // Devolvemos el dinero al apostador
                    User user = apuesta.getApostador();
                    user.setDineroRetenido(user.getDineroRetenido() - apuesta.getCantidad());
                    user.setDineroDisponible(user.getDineroDisponible() + apuesta.getCantidad());
                    entityManager.persist(user);
                } else if ((formula.getResultado() == Resultado.GANADO && apuesta.isAFavor())
                        || (formula.getResultado() == Resultado.PERDIDO && !apuesta.isAFavor())) {
                    // Ha ganado por lo que se le suma el dinero apostado por la cuota
                    double cuota = formula.calcularCuota(apuesta.isAFavor());
                    double dineroGanado = cuota * apuesta.getCantidad();

                    User user = apuesta.getApostador();
                    user.setDineroRetenido(user.getDineroRetenido() - apuesta.getCantidad());
                    user.setDineroDisponible(user.getDineroDisponible() + dineroGanado);
                    entityManager.persist(user);
                } else {
                    // Ha perdido por lo que se resta el dinero apostado del dinero retenido

                    User user = apuesta.getApostador();
                    user.setDineroRetenido(user.getDineroRetenido() - apuesta.getCantidad());
                    entityManager.persist(user);
                }
            }

            entityManager.persist(formula);
            entityManager.flush(); // forzamos a que se haga la consulta para que no se quede en la cola de espera
        }

        evento.setDeterminado(true);
        entityManager.persist(evento);
    }

    private void cancelarEvento(Evento evento) {
        // Verificamos que el evento no sea null y que no esté ya cancelado
        if (evento != null && !evento.isCancelado()) {
            // Marcamos el evento como cancelado
            evento.setCancelado(true);
            entityManager.persist(evento); // Persistimos el cambio del estado del evento

            // Ahora vamos a revertir las apuestas asociadas al evento
            for (FormulaApuesta formula : evento.getFormulasApuestas()) {
                for (Apuesta apuesta : formula.getApuestas()) {
                    // Devolver el dinero al apostador
                    User user = apuesta.getApostador();
                    user.setDineroRetenido(user.getDineroRetenido() - apuesta.getCantidad());
                    user.setDineroDisponible(user.getDineroDisponible() + apuesta.getCantidad());
                    entityManager.persist(user);
                }
            }
            entityManager.flush(); // Aseguramos que todos los cambios se guardan en la base de datos
        }
    }
}
