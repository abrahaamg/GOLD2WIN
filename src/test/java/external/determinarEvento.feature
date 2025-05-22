Feature: Testeo UI con Karate

  Scenario: Prueba que consiste en determinar un evento existente y comprobar que las apuestas se devuelven correctamente
    Given driver baseUrl + '/login'

    * click('#debugButtonA')
    # Se va a la parte de mis apuestas y se despliegan las apuestas relacionadas con Campeonato Mundial de Esgrima
    * click('#enlaceNavMisApuestas') 
    * delay(1000)

    #Se va a la parte de admin/eventos y se rellenan las variables para determinar el evento
    * click('#enlaceNavAdmin')
    * delay(300)
    * click('#menuAdminEventos')
    * delay(300)
    * click('#dropdownMenuButton-5')
    * delay(300)
    * click('#botonDropdownDeterminarEvento-5')
    And input('#_ToquesJugA', '8')
    And input('#_ToquesJugB', '5')
    And input('#_PenalizacionesJugA', '3')
    And input('#_PenalizacionesJugB', '12')

    * delay(500)
    * click('#btn_determinar')
    * delay(500)
    # Se vuelve a mis apuestas para ver que se han determinado
    * click('#enlaceNavMisApuestas')
    * delay(3000)