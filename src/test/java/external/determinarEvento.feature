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
    And input('#_Toques', '8')
    And input('#_NumToquesEspaña', '5')
    And input('#_NumToquesRusia', '3')
    And input('#_DuracionCombateSegundos', '200')
    And input('#_ToquesDobles', '4')
    And input('#_TarjetasAmarillasEspaña', '1')
    And input('#_TarjetasAmarillasRusia', '2')
    And input('#_TarjetasRojasEspaña', '0')
    And input('#_TarjetasRojasRusia', '0')
    And input('#_ParadasEspaña', '2')
    And input('#_ParadasRusia', '2')
    * delay(1000)
    * click('#btn_determinar')

    # Se vuelve a mis apuestas para ver que se han determinado
    * click('#enlaceNavMisApuestas')
    * delay(500)
    * click('#bettingBox-5')
    * click('#bettingBox-16')
    * delay(5000)