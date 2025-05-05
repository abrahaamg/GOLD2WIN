Feature: Testeo UI con Karate

  Scenario: Prueba que consiste en determinar un evento existente y comprobar que las apuestas se devuelven correctamente
    Given driver baseUrl + '/login'

    * click('#debugButtonA')
    # Se va a la parte de mis apuestas y se despliegan las apuestas relacionadas con Campeonato Mundial de Esgrima
    * click('#enlaceNavAdmin')
    * delay(300)
    * click('#menuAdminEventos')
    * delay(300)
    * click('#botonCrearEvento')
    * delay(300)
    And input('#inputNombreEvento', 'EventoPrueba')
    * delay(500)
    * script("document.querySelector('#seccionSelect').value = '3'")
    * script("document.querySelector('#seccionSelect').dispatchEvent(new Event('change'))")
    * delay(300)
    * click('#botonEtiquetas')
    * click('#inputEtiqueta')
    And input('#inputEtiqueta' , 'etiquetaPrueba')
    * delay(300)
    * script("document.querySelector('#inputEtiqueta').dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}))")
    * click('#botonVariables')
    * delay(500)
    * click('#submit-form-eventos')
    * delay(5000)