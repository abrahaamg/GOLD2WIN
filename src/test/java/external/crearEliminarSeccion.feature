Feature: Testeo UI para crear y eliminar una sección

Scenario: Crear una nueva sección, añadir una variable, subir una imagen y luego eliminarla
  Given driver 'http://localhost:8080/login'
  * click('#debugButtonA')
  * click('#botonSecciones')
  * click('#botonCrearSeccion')
  * input('#inputNombreSeccion', 'testSeccion')
  * input('#inputTipoSeccion', 'testSeccion A')
  * input('input[type="file"]', { file: 'src/test/resources/static/img/default-pic.jpg' })
  * delay(2000)
  * click('#botonCrearVariable')
  * input('#inputnombreVarNueva', 'var 1')
  * select('#selectTipoVarNueva', 'Texto')
  * click("button.btn.btn-success")
  * delay(2000)
  * click('#confirmarSeccionButton')
  * match text("span.spanAjustadoAdmin") contains "testSeccion"
  * click('#menuOpcionesSeccion a:nth-child(2)')
  * click('#modalEliminarSeccion .botonEliminarSeccionP')
  * match text("span.spanAjustadoAdmin") !contains "testSeccion"
