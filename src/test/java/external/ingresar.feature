Feature: Testeo UI con Karate

  Scenario: Prueba que consiste en crear una apuesta usando una fórmula de apuesta y verla desde tu historial
    Given driver baseUrl + '/login'
    
    * click('#debugButtonB')
    * delay(300)
    * click('#enlaceNavCartera')
    * delay(1000)
    * click('#botonEnlaceIngresar')
    * delay(300)
    And input('#ingresoDineroInput', '12,48')
    * delay(300)
    * click('#botonConfirmarIngreso')
    * delay(1000)
