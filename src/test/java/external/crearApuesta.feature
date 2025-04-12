Feature: Testeo UI con Karate

  Scenario: Prueba que consiste en crear una apuesta usando una fórmula de apuesta y verla desde tu historial
    Given driver baseUrl + '/login'
    
    * click('#debugButtonA')
    # Se va a la parte de todos los eventos disponibles
    * click('#enlaceNavTodosEventos')
    # Clicka en el evento de Sede Mundial de Beisbol
    * click('#contenedorEvento-3')
    # Se añade una cantidad a una formula para crear una apuesta
    * delay(1000)
    And input('#cantidad-3', '15')
    * delay(2000)
    * click('.botonApostarFavorable')
    * delay(4000)

    # Se va a la parte de mis apuestas y se despliega la apuesta creada
    * click('#enlaceNavMisApuestas')
    * click('#bettingBox-975')
    * delay(7000)
    