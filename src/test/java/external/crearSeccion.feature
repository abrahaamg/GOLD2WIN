Feature: Testeo UI con Karate

  Scenario: Prueba que consiste en determinar un evento existente y comprobar que las apuestas se devuelven correctamente
    Given driver baseUrl + '/login'

    * click('#debugButtonA')

    #Se va a la parte de admin/eventos y se rellenan las variables para determinar el evento
    * click('#enlaceNavAdmin')
    * click('#menuAdminSecciones')
    * click('.enlaceSeccionAdmin')
    * click('#botonEditarSeccion')
    * click('#botonEditarSeccionDef')
    * delay(5000)