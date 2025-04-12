package es.ucm.fdi.iw.model;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import es.ucm.fdi.iw.model.Resultado;

import com.ezylang.evalex.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormulaApuesta implements Transferable<FormulaApuesta.Transfer> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "evento_id")
    private Evento evento;
    
    @ManyToOne
    @JoinColumn(name = "creador_id")
    private User creador;
    
    private String formula;
    private LocalDateTime fechaCreacion;
    private String nombre;
    private double dineroAfavor;
    private double dineroEnContra;

    @Enumerated(EnumType.STRING)
    private Resultado resultado; 
    
    
    @OneToMany(mappedBy = "formulaApuesta")
    private List<Apuesta> apuestas;


    @Transient
    public double calcularCuota(boolean aFavor) {
        if (aFavor) {
            double dineroEnContraAux = dineroEnContra * (1-0.05); // 5% comision
            return dineroAfavor > 0 ? (((dineroAfavor + dineroEnContraAux) / dineroAfavor)) : 1.0;
        } else {
            double dineroAfavorAux = dineroAfavor * (1-0.05); // 5% comision
            return dineroEnContra > 0 ? (((dineroEnContra + dineroAfavorAux) / dineroEnContra)) : 1.0;
        }
    }

    @Transient
    public static boolean formulaValida(String formula, Evento evento) {
        boolean res = true;

        Map<String, Variable> variablesEvento = new HashMap<>();
        for (Variable variable : evento.getVariables()) {
            variablesEvento.put(variable.getNombre(), variable);
        }

        try{
            Expression expresion = new Expression(formula);
            String variablesNecesarias[] = expresion.getUndefinedVariables().toArray(new String[0]);

            for (String variable : variablesNecesarias) {
                if (!variablesEvento.containsKey(variable)) {
                    res = false;
                    break;
                }
            }
        }
        catch (Exception e){
            res = false;
        }
        
        if(formula.equals("")){
            res = false;
        }

        return res;
    }

    //COSAS PARA MANDAR DATOS CON AJAX A JS
    @Getter
    @AllArgsConstructor
    public static class Transfer {
        private long id;
		private String nombre;
        private String formula;
        private double cuotaFaborable;
        private double cuotaDesfavorable;
    }

    public FormulaApuesta.Transfer toTransfer(){
        return new FormulaApuesta.Transfer(id, nombre, formula, calcularCuota(true), calcularCuota(false));
    }

}
