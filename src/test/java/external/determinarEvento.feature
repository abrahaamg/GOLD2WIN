Feature: Testeo UI con Karate

  Scenario: Prueba que consiste en determinar un evento existente y comprobar que las apuestas se devuelven correctamente
    Given driver baseUrl + '/login'

    * click('#debugButtonA')
    # Se va a la parte de mis apuestas y se despliegan las apuestas relacionadas con Campeonato Mundial de Esgrima
    * click('#enlaceNavMisApuestas')
    * delay(500)
    * click('#bettingBox-5')
    * click('#bettingBox-16')
    * delay(3000)

    #Se va a la parte de admin/eventos y se rellenan las variables para determinar el evento
    * click('#enlaceNavAdmin')
    * click('#menuAdminEventos')
    * click('#botonDeterminarEvento-5')
    And input('#_toques', '8')
    And input('#_numToquesEspaña', '5')
    And input('#_numToquesRusia', '3')
    And input('#_duracionCombateSegundos', '200')
    And input('#_toquesDobles', '4')
    And input('#_tarjetasAmarillasEspaña', '1')
    And input('#_tarjetasAmarillasRusia', '2')
    And input('#_tarjetasRojasEspaña', '0')
    And input('#_tarjetasRojasRusia', '0')
    And input('#_paradasEspaña', '2')
    And input('#_paradasRusia', '2')
    * delay(1000)
    * click('#btn_determinar')

    # Se vuelve a mis apuestas para ver que se han determinado
    * click('#enlaceNavMisApuestas')
    * delay(500)
    * click('#bettingBox-5')
    * click('#bettingBox-16')
    * delay(5000)