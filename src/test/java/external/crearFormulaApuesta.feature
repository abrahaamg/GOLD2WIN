Feature: Testeo UI con Karate

  Scenario: Prueba que consiste en crear una formula de apuesta y verla desde otro usuario
    Given driver baseUrl + '/login'

    * click('#debugButtonA')
    # Se va a la parte de todos los eventos disponibles
    * click('#enlaceNavTodosEventos')
    # Clicka en el evento de NBA
    * click('#contenedorEvento-2')
    # Se crea la formula
    * click('#boton-crear-formula')
    * delay(500)
    And input('#tituloModal', 'Victoria Lakers')
    And input('#formulaModal', 'Puntos-EquipA > Puntos-EquipB')
    * delay(1000)
    * click('#botonSiguienteCrearApuesta')
    * delay(500)
    And input('#cantidadModal', '20')
    * delay(500)
    * click('#botonCrearApuestaDefinitiva')
    * delay(2000)

    # Se cambia de usuario y se ve la formula creada con el otro usuario
    * click('#usuarioNav')
    * delay(500)
    * click('#botonNavCerrarSesion')
    * click('#debugButtonB')
    * click('#enlaceNavTodosEventos')
     * click('#contenedorEvento-2')
    * delay(6000)