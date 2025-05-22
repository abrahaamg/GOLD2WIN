Feature: Testeo UI con Karate

  Scenario: Prueba que consiste en crear una apuesta usando una fórmula de apuesta y verla desde tu historial
    Given driver baseUrl + '/login'
    
    * click('#debugButtonA')
    # Se va a la parte de todos los eventos disponibles
    #* click('#enlaceNavTodosEventos')
    # Clicka en el evento de Sede Mundial de Beisbol
    * click('#contenedorEvento-1')
    # Se añade una cantidad a una formula para crear una apuesta
    * delay(1000)
    And input('#cantidad-1', '15')
    * delay(1000)
    * click('.botonApostarFavorable')
    * delay(2000)

    # Se va a la parte de mis apuestas y se despliega la apuesta creada
    * click('#enlaceNavMisApuestas')
    * delay(3000)
    