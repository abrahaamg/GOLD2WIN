package es.ucm.fdi.iw.controller;

import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.HashSet;

import com.ezylang.evalex.*;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.ezylang.evalex.data.EvaluationValue;
import com.ezylang.evalex.data.EvaluationValue.DataType;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import es.ucm.fdi.iw.LocalData;
import es.ucm.fdi.iw.model.Apuesta;
import es.ucm.fdi.iw.model.Evento;
import es.ucm.fdi.iw.model.FormulaApuesta;
import es.ucm.fdi.iw.model.Reporte;
import es.ucm.fdi.iw.model.Resultado;
import es.ucm.fdi.iw.model.Seccion;
import es.ucm.fdi.iw.model.User;
import es.ucm.fdi.iw.model.Variable;
import es.ucm.fdi.iw.model.VariableSeccion;
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
    private LocalData localData;

    @Autowired
    private EntityManager entityManager;

    @Autowired
	private SimpMessagingTemplate messagingTemplate;

    private static final Logger log = LogManager.getLogger(AdminController.class);

    @ModelAttribute
    public void populateModel(HttpSession session, Model model) {
        for (String name : new String[] { "u", "url", "ws", "topics" }) {
            model.addAttribute(name, session.getAttribute(name));
        }
    }

    @GetMapping("/usuarios")
    public String usuarios(Model model){
        String queryUsuarios = "SELECT u FROM User u";
        List<User> usuarios = entityManager.createQuery(queryUsuarios, User.class).getResultList();

        model.addAttribute("usuarios", usuarios);

        return "usuarios";
    }

    @GetMapping("/usuarios/usuarioDetalles")
    public String usuarioDetalles(Model model){
        return "usuarioDetalles";
    }

    @GetMapping("/usuarios/transacciones")
    public String transacciones(Model model){
        return "transacciones";
    }

    @GetMapping("/reportes")
    public String tablaReportes(Model model) {
        String queryReportes = "SELECT r FROM Reporte r";
        List<Reporte> reportes = entityManager.createQuery(queryReportes, Reporte.class).getResultList();

        model.addAttribute("reportes", reportes);
        
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

        if (!evento.getFechaCierre().isBefore(OffsetDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El evento aun no se ha producido");
        }

        if (evento.isDeterminado()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El evento ya ha sido determinado");
        }

        model.addAttribute("eventoSel", evento);

        return "determinarEvento";
    }

    @GetMapping(path = "/eventos/getVariablesSeccion/{id}", produces = "application/json")
    @ResponseBody
    public Map<String, Boolean> getVariablesSeccion(@PathVariable long id,Model model) {
        Map<String, Boolean> variables = new HashMap<>();
        Seccion seccion = entityManager.find(Seccion.class, id);

        if (seccion == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Seccion no encontrada");
        }

        seccion.getPlantilla().forEach(variable -> {
            variables.put(variable.getNombre(), variable.isNumerico());
        });

        return variables;
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

        if (!evento.getFechaCierre().isBefore(OffsetDateTime.now())) {
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

    /*
     * LA FUNCION CREA UN EVENTO EN EL CASO DE QUE EL ID SEA -1. EN OTRO CASO INTENTA EDITAR
     * UN EVENTO QUE YA EXISTE. 
     *  
     * codigos de error:
     * 1: no se han definido variables
     * 2: la fecha del evento no puede ser anterior a la actual
     * 3: seccion no valida
     * 4: no se han definido etiquetas
     * 5: el nombre de la variable no puede contener espacios
     * 6: el nombre de la variable debe ser unico
     */
    @PostMapping(path = "/eventos/crearEvento", produces = "application/json")
    @ResponseBody
    @Transactional
    public Map<String, Object> crearEvento(@RequestBody JsonNode o) {
        Map<String, Object> resultado = new HashMap<>();
        OffsetDateTime fecha = OffsetDateTime.parse(o.get("fecha").asText());
        long id = o.get("idEvento").asLong();
        List<String> etiquetas = new ArrayList<>();
        List<Variable> variables = new ArrayList<>();
        Evento evento = new Evento();

        if(id != -1) {
            evento = entityManager.find(Evento.class, id);

            if (evento == null) {
                resultado.put("success", false);
                resultado.put("errorCode", 8);
                resultado.put("error", "Evento no encontrado");
                return resultado;
            }
        }

        // Verificamos que no hay 2 etiquetas con el mismo nombre
        Set<String> etiquetaNames = new HashSet<>();
        for (JsonNode etiqueta : o.get("etiquetas")) {
            String nombreEtiqueta = etiqueta.asText();

            if (!etiquetaNames.add(nombreEtiqueta)) {
                resultado.put("success", false);
                resultado.put("errorCode", 7);
                resultado.put("error", "El nombre de la etiqueta debe ser único: " + nombreEtiqueta);
                return resultado;
            }
            else
                etiquetas.add(nombreEtiqueta);
        }

        //Verificamos que no hay 2 variables con el mismo nombre y que una variable no puede tener espacios en blanco
        Set<String> variableNames = new HashSet<>();

        if(id != -1)
            variableNames = evento.getVariables().stream().map(Variable::getNombre).collect(Collectors.toSet());

        for (JsonNode varJsonNode : o.get("variables")) {
            String nombreVariable = varJsonNode.get("nombre").asText();
            if (nombreVariable.contains(" ")) {
                resultado.put("success", false);
                resultado.put("errorCode", 5);
                resultado.put("error", "El nombre de la variable no puede contener espacios: " + nombreVariable);
                return resultado;
            }

            if (!variableNames.add(nombreVariable)) {
                resultado.put("success", false);
                resultado.put("errorCode", 6);
                resultado.put("error", "El nombre de la variable debe ser único: " + nombreVariable);
                return resultado;
            }

            Variable var = new Variable();
            var.setNombre(nombreVariable);
            var.setNumerico(varJsonNode.get("numerica").asBoolean());
            variables.add(var);
        }

        //Si se esta creando un evento nuevo
        if(id == -1){
            long seccion = o.get("seccion").asLong();
            Seccion seccionObj = null;
            String nombre = o.get("nombre").asText();

            //Puedes modificar un evento existente sin añadir ninguna variable nueva
            if(variables.size() == 0 ) {
                resultado.put("success", false);
                resultado.put("errorCode", 1);
                resultado.put("error", "No se han definido variables para el evento");
                return resultado;
            }

            //Puedes modificar un evento existente como que ya ha pasado
            if(OffsetDateTime.now().isAfter(fecha) ) {
                resultado.put("success", false);
                resultado.put("errorCode", 2);
                resultado.put("error", "La fecha del evento no puede ser anterior a la actual");
                return resultado;
            }

            seccionObj = entityManager.find(Seccion.class, seccion);
            if (seccionObj == null) {
                resultado.put("success", false);
                resultado.put("errorCode", 3);
                resultado.put("error", "Sección no válida");
                return resultado;
            }

            //Puedes modificar un evento existente sin añadir ninguna etiqueta nueva
            if(etiquetas.size() == 0 && id == -1) {
                resultado.put("success", false);
                resultado.put("errorCode", 4);
                resultado.put("error", "No se han definido etiquetas para el evento");
                return resultado;
            }

            evento.setNombre(nombre);
            evento.setFechaCierre(fecha);
            evento.setFechaCreacion(OffsetDateTime.now());
            evento.setCancelado(false);
            evento.setDeterminado(false);
            evento.setSeccion(seccionObj);
            evento.setEtiquetas(etiquetas);
    
            entityManager.persist(evento);

            for(Variable variable : variables) {
                variable.setEvento(evento);
                entityManager.persist(variable);
            }
        }
        else{ //si se esta editando un evento existente
            evento.setFechaCierre(fecha);
            evento.setEtiquetas(etiquetas);
            
            for(Variable variable : variables) {
                variable.setEvento(evento);
                entityManager.persist(variable);
            }

            entityManager.merge(evento);
        }

        entityManager.flush();
        resultado.put("success", true);

        return resultado;
    }

    @GetMapping(path = "/eventos/cargarDatosEvento/{id}", produces = "application/json")
    @ResponseBody
    public Map<String, Object> cargarDatosEvento(@PathVariable long id) {
        Map<String, Object> resultado = new HashMap<>();

        Evento evento = entityManager.find(Evento.class, id);
        List<Variable.Transfer> variables = new ArrayList<>();

        if (evento == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");
        }

        evento.getVariables().forEach(variable -> {
            variables.add(variable.toTransfer());
        });

        resultado.put("nombre", evento.getNombre());
        resultado.put("fechaCierre", evento.getFechaCierre().toString());
        resultado.put("seccion", evento.getSeccion().getId());
        resultado.put("etiquetas", evento.getEtiquetas());
        resultado.put("variables", variables);

        return resultado;
    }

    @GetMapping("/secciones")
    public String secciones(Model model) {
        // obtengo las secciones
        List<Seccion> secciones = entityManager.createNamedQuery("Seccion.getAll", Seccion.class).getResultList();

        model.addAttribute("secciones", secciones);

        return "secciones";
    }

    @GetMapping("/secciones/{id}/editar")
    public String editarSeccion(@PathVariable long id, Model model, HttpSession session) {
        Seccion target = entityManager.find(Seccion.class, id);
        List<Seccion> secciones = entityManager.createNamedQuery("Seccion.getAll", Seccion.class).getResultList();

        model.addAttribute("seccionEditable", target);
        model.addAttribute("secciones", secciones);

        return "editarSeccion";
    }

    @GetMapping("/secciones-crearSeccion")
    public String seccionesCrear(Model model) {
        // obtengo las secciones
        List<Seccion> secciones = entityManager.createNamedQuery("Seccion.getAll", Seccion.class).getResultList();

        model.addAttribute("secciones", secciones);

        return "secciones-crearSeccion";
    }

   

    @GetMapping("/eventos")
    public String eventos(Model model) {
        String queryEventos = "SELECT e FROM Evento e WHERE e.cancelado = false";
        List<Evento> eventos = entityManager.createQuery(queryEventos, Evento.class).getResultList();
        List<Seccion> secciones = entityManager.createNamedQuery("Seccion.getAll",Seccion.class).getResultList();

        model.addAttribute("eventos", eventos);
        model.addAttribute("secciones", secciones);
        

        return "eventos";
    }

    // Logica para determinar evento
    // El evento tiene que haberse traido previamente de la base de datos y
    // verificado que no sea null
    private void determinarEvento(Evento evento, Map<String, Object> variables){
        Set<User> apostadoreSet = new HashSet<>(); 

        // Primero establezco el valor de las variables en la BD
        for (Variable variable : evento.getVariables()) {
            if (variable != null) {
                variable.setResolucion(variables.get(variable.getNombre()).toString());
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
                User user = apuesta.getApostador();
                if (formula.getResultado() == Resultado.ERROR) {
                    // Devolvemos el dinero al apostador
                
                    user.setDineroRetenido(user.getDineroRetenido() - apuesta.getCantidad());
                    user.setDineroDisponible(user.getDineroDisponible() + apuesta.getCantidad());
                } else if ((formula.getResultado() == Resultado.GANADO && apuesta.isAFavor())
                        || (formula.getResultado() == Resultado.PERDIDO && !apuesta.isAFavor())) {
                    // Ha ganado por lo que se le suma el dinero apostado por la cuota
                    double cuota = formula.calcularCuota(apuesta.isAFavor());
                    int dineroGanado = (int)cuota * apuesta.getCantidad(); //trunco decimales

                    user.setDineroRetenido(user.getDineroRetenido() - apuesta.getCantidad());
                    user.setDineroDisponible(user.getDineroDisponible() + dineroGanado);
                } else {
                    // Ha perdido por lo que se resta el dinero apostado del dinero retenido
                    user.setDineroRetenido(user.getDineroRetenido() - apuesta.getCantidad());
                }

                apostadoreSet.add(user);
            }

            entityManager.flush();

            for(User apostador : apostadoreSet) {
                Map<String, Object> mensaje = new HashMap<>();
                mensaje.put("tipoEvento", "actualizarDinero");
                mensaje.put("dineroDisponible", apostador.getDineroDisponible());
                mensaje.put("dineroRetenido", apostador.getDineroRetenido());
                ObjectMapper mapper = new ObjectMapper();
		        String json;

                try {
                    json = mapper.writeValueAsString(mensaje);
                    messagingTemplate.convertAndSend("/user/"+apostador.getUsername()+"/queue/updates", json);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            }
        }

        evento.setDeterminado(true);

        entityManager.flush();
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

    @Transactional
    @ResponseBody
    @PostMapping("/guardarSeccion")
    public ResponseEntity<JsonNode> guardarSeccion(@RequestBody JsonNode json) throws IOException{
        // Crear una respuesta JSON con el mensaje
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        response.put("mensaje", "Seccion guardada correctamente");

        JsonNode seccionNode = json.get("seccionN");
        if (seccionNode == null || !seccionNode.has("nombre") || !seccionNode.has("tipo")) {
            return ResponseEntity.badRequest().body(objectMapper.createObjectNode().put("error", "Datos de seccionN incompletos"));
        }

        String nombre = seccionNode.get("nombre").asText();
        String grupo = seccionNode.get("tipo").asText();

        Seccion nuevaSeccion = new Seccion();
        nuevaSeccion.setNombre(nombre);
        nuevaSeccion.setGrupo(grupo);
        nuevaSeccion.setEnabled(true);
        entityManager.persist(nuevaSeccion);
        entityManager.flush();  //para asegurar que exista la sección cuando se añadan variables

        JsonNode itemsNode = json.get("arrayVariables");
        if (itemsNode != null && itemsNode.isArray()) {
            for (JsonNode item : itemsNode) {

                String nombreV = item.get("nombreV").asText();
                String tipoV = item.get("tipoV").asText();

                VariableSeccion nuevaVariable = new VariableSeccion();
                nuevaVariable.setNombre(nombreV);
                nuevaVariable.setNumerico(tipoV.equals("Valor numérico"));
                nuevaVariable.setSeccion(nuevaSeccion);
                entityManager.persist(nuevaVariable);
            }
        }

        JsonNode imageDataNode = json.get("imageData");
        if (imageDataNode != null && imageDataNode.has("image")) {
            String base64Image = imageDataNode.get("image").asText();
            String filename = imageDataNode.get("filename").asText();

            MultipartFile photo = convertirBase64AMultipartFile(base64Image, filename);
            setPic(photo, "seccion", ""+ nuevaSeccion.getId());
        }
        return ResponseEntity.ok(response);
    }

    @Transactional
    @ResponseBody
    @DeleteMapping("/eliminarSeccion/{id}")
    public ResponseEntity<JsonNode> eliminarSeccion(@PathVariable Long id) {
        Seccion seccion = entityManager.find(Seccion.class, id);

        if (seccion != null) {
            seccion.setEnabled(false);
            entityManager.merge(seccion);
        }

        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        response.put("mensaje", "Seccion eliminada correctamente");
        return ResponseEntity.ok(response);
    }

    @Transactional
    @ResponseBody
    @PostMapping("/editarSeccion")
    public ResponseEntity<JsonNode> editarSeccion(@RequestBody JsonNode json) throws IOException{
        // Crear una respuesta JSON con el mensaje
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        response.put("mensaje", "Seccion editada correctamente");

        JsonNode seccionNode = json.get("seccionN");
        if (seccionNode == null || !seccionNode.has("nombre") || !seccionNode.has("tipo")) {
            return ResponseEntity.badRequest().body(objectMapper.createObjectNode().put("error", "Datos de seccionN incompletos"));
        }

        String nombre = seccionNode.get("nombre").asText();
        String grupo = seccionNode.get("tipo").asText();

        Seccion seccion = entityManager.createNamedQuery("Seccion.getPorNombre", Seccion.class).setParameter("nombre", nombre).getSingleResult();

        seccion.setGrupo(grupo);    
        entityManager.merge(seccion);

        JsonNode itemsNode = json.get("arrayVariables");

        List<VariableSeccion> vars = entityManager.createNamedQuery("VarSeccion.filtrarPorSeccion", VariableSeccion.class).setParameter("seccion", seccion).getResultList();
        for(VariableSeccion variable : vars) {
            seccion.getPlantilla().remove(variable);
            entityManager.persist(seccion);
            
            entityManager.remove(variable);
        }
        if (itemsNode != null && itemsNode.isArray() && itemsNode.size() > 0) {
            //borrar las variables antiguas
            //String queryDelete = "DELETE FROM VariableSeccion v WHERE v.seccion = :seccion";
            //entityManager.createQuery(queryDelete).setParameter("seccion", seccion).executeUpdate();
            
            for (JsonNode item : itemsNode) {

                String nombreV = item.get("nombreV").asText();
                String tipoV = item.get("tipoV").asText();


                VariableSeccion nuevaVariable = new VariableSeccion();
                nuevaVariable.setNombre(nombreV);
                nuevaVariable.setNumerico(tipoV.equals("Valor numérico"));
                nuevaVariable.setSeccion(seccion);
                entityManager.persist(nuevaVariable);
            }
        }

        JsonNode imageDataNode = json.get("imageData");
        if (imageDataNode != null && imageDataNode.has("image") && !imageDataNode.get("image").isNull()) {
            String base64Image = imageDataNode.get("image").asText();
            String filename = imageDataNode.has("filename") ? imageDataNode.get("filename").asText() : "";

            if (!base64Image.isEmpty()) {
                    MultipartFile photo = convertirBase64AMultipartFile(base64Image, filename);
                    setPic(photo, "seccion", ""+seccion.getId());
            }
        }
        return ResponseEntity.ok(response);
    }

    @ResponseBody
    public String setPic(MultipartFile photo, String carpeta, String nombre) throws IOException {
		log.info("Updating photo for user {}", nombre);
		File f = localData.getFile(carpeta, nombre+".jpg");
		if (photo.isEmpty()) {
			log.info("failed to upload photo: emtpy file?");
		} else {
			try (BufferedOutputStream stream =
					new BufferedOutputStream(new FileOutputStream(f))) {
				byte[] bytes = photo.getBytes();
				stream.write(bytes);
                log.info("Uploaded photo for {} into {}!", nombre, f.getAbsolutePath());
			} catch (Exception e) {
				log.warn("Error uploading " + nombre + " ", e);
			}
		}
		return "{\"status\":\"photo uploaded correctly\"}";
    }

    @GetMapping("/verificarSeccion")
    public ResponseEntity<?> verificarSeccion(@RequestParam String nombre) {
        nombre = nombre.trim(); 

        Long count = entityManager.createNamedQuery("Seccion.countByNombre", Long.class).setParameter("nombre", nombre)
                                .getSingleResult();

        boolean existe = count > 0; // Si el numero es mayor a 0, ya existe

        return ResponseEntity.ok().body("{\"existe\": " + existe + "}");
    }

    public MultipartFile convertirBase64AMultipartFile(String base64, String filename) throws IOException {

        byte[] imageBytes = Base64.getDecoder().decode(base64.split(",")[1]);

        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(imageBytes);

        MultipartFile photo = new MultipartFile() {
            @Override
            public String getName() {
                return filename;
            }

            @Override
            public String getOriginalFilename() {
                return filename;
            }

            @Override
            public String getContentType() {
                return "image/jpeg"; 
            }

            @Override
            public boolean isEmpty() {
                return imageBytes == null || imageBytes.length == 0;
            }

            @Override
            public long getSize() {
                return imageBytes.length;
            }

            @Override
            public byte[] getBytes() throws IOException {
                return imageBytes;
            }

            @Override
            public InputStream getInputStream() throws IOException {
                return byteArrayInputStream;
            }

            @Override
            public void transferTo(File dest) throws IOException, IllegalStateException {
                java.nio.file.Files.write(dest.toPath(), imageBytes);
            }
        };

        return photo;
    }

}
