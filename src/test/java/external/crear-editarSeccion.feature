Feature: Testeo UI con Karate

  Scenario: Prueba que consiste en crear y editar una seccion
    Given driver baseUrl + '/login'

    * click('#debugButtonA')
    # Se va a la parte de Admin-Secciones
    * click('#enlaceNavAdmin')
    * click('#menuAdminSecciones')
    # Se accede a la vista de crearSeccion
    * click('#botonCrearSeccion')
    * delay(300)
    And input('#inputNombreSeccion', 'seccionPrueba')
    And input('#inputTipoSeccion', 'aTipoSeccionPrueba')
    And input('#inputImagenSecciones', '../../../iwdata/seccion/1.jpg')
    * delay(500)
    # Se añade una variable
    * click('#botonCrearVariable')
    * delay(300)
    And input('#inputnombreVarNueva', 'variablePrueba')
    * delay(300)
    And select('#selectTipoVarNueva', 1)
    * delay(500)
    * click('#botonAnhadirVariableSeccion')
    * delay(500)
    * click('#botonDefinitivoCrearSeccion')
    * delay(500)
    
    # Se edita la seccion creada
    * click('#enlaceSeccion-975')
    And input('#inputTipoSeccion', 'Modficada')
    * delay(500)
    * click('#botonDefEditarSeccion')
    * delay(500)
    * click('#botonDefinitivoEditarSeccion')
    * delay(5000)