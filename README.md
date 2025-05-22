# G<font color="D4AF37">O</font>LD<font color="D4AF37">2</font>WIN

## Índice

- [Cómo ejecutar](#cómo-ejecutar)
- [Descripción del proyecto](#descripción-del-proyecto)
- [Vistas](#vistas)
  - [1. Todas las secciones](#1-todas-las-secciones)
  - [2. Crear apuesta](#2-crear-apuesta)
  - [3. Cartera](#3-cartera)
  - [4. Historial de apuestas](#4-historial-de-apuestas)
  - [5. Chats](#5-chats)
  - [6. Administración](#6-administración)
    - [6.1 Usuarios](#61-usuarios)
    - [6.2 Reportes](#62-reportes)
    - [6.3 Eventos](#63-eventos)
    - [6.4 Secciones](#64-secciones)
- [Modelo de la base de datos](#modelo-de-la-base-de-datos)
- [Rutas de la aplicacion](#rutas-de-la-aplicación)
- [Recursos utilizados](#recursos-utilizados)

## 🚀Cómo ejecutar

#### Requisitos previos
- Java 21 o superior instalado.
- Maven instalado.

#### Pasos para ejecutar el proyecto

1. **Clonar el repositorio**

```bash
git https://github.com/abrahaamg/IW.git
cd IW
```

2. **Compilar el proyecto**
```bash
mvn clean install
```

3. **Ejecutar la aplicación**
```bash
mvn spring-boot:run
```

4. **Abrir la aplicación**
Busca https://localhost:8080 en el navegador.

## 📋Descripción del proyecto
Gold2Win es una casa de apuestas en la cual se puede apostar a diferentes eventos que se pueden ir añadiendo. Estos eventos se clasifican en secciones como deportes, esports, juegos de mesa o cualquier cosa imaginable. 

Cada evento lleva asociadas una serie de variables como por ejemplos (goles-barcelona) con las que los apostadores pueden crear sus propias fórmulas y apostar a ellas. Las cuotas se calculan dinámicamente según cuanto dinero se ha apostado a favor y en contra de la fórmula, quedandose un pequeño porcentaje la página por sus servicios. Los eventos también llevan asociados etiquetas que sirven para resaltar cosas importantes del evento como la competición, la ronda, los equipos, etc. Los eventos llevan asociada la fecha en que se van a llevar a cabo y una vez llevados a cabo un administrador debe encargarse de determinar como ha sucedido el evento. Es decir, dar valores a las variables previamente definidas para poder determinar automáticamente que formulas se han cumplido y poder repartir el dinero entre los apostadores. 

Las secciones ,además, de para clasificar los eventos, llevan asociada una plantilla de variables recurrentes en los eventos de esa sección. Esto sirve para facilitar la tarea de los administradores que tendrán que crear los eventos.

Cada usuario tendrá acceso a un historial donde ver las diferentes apuestas que ha realizado, así como su estado (ganadas, perdidas, indeterminadas).

Además, se implementa un sistema de chats grupales asociado a cada evento donde los usuarios pueden apostar y hablar sobre el evento. Un usuario puede hablar por el chat sin estar suscrito y si se suscribe el chat aparecerá de manera más accesible en la pestaña de chats indicandole cuantos mensajes le quedan por leer y recibiendo notificaciones al llegar mensajes nuevos. Para evitar problemas en los chats, los usuarios pueden reportar un mensaje pulsando click derecho y un administrador es el encargado de revisar el mensaje y aplicar una sanción si lo considera necesario. Las sanciones son expulsiones temporales que una vez aplicada a un usuario este cierra sesión automáticamente y no se le permite volver a iniciarla hasta que haya pasado el tiempo de expulsión.

Las cuentas se dividen en 2 tipos:
- **Usuarios**: Esta es la cuenta estandar con la cual el usuario puede crear formulas de apuesta, apostar, chatear, reportar, ver perfiles de otros usuarios, ver su historico y acceder al perfil de otro usuario.
- **Administrador**: Este usuario tiene las mismas funciones que un usuario normal pero además puede acceder a la zona de administración donde puede ver la lista de usuarios, reportes, eventos y secciones. Puede expulsar a un usuario, indicar que se ha revisado un reporte aplicando la penalización necesaria, crear un evento, editar un evento ya creado, cancelar un evento (esto devuelve todo el dinero a los usuarios), ver los detalles de un evento, crear una sección y editar las ya existentes. 


## 👁️‍🗨️Vistas{#vistas}
### 1. Todas las secciones
Es la recepción de la página y donde se pueden ver todos los eventos apostables que aún no han ocurrido. En cada uno se ve el título, la fecha, imagen de a sección, las etiquetas y un botón para unirse al chat de texto e ir a verlo. Pulsando sobre los eventos el usuario es redirigido a la pagina de crear apuesta del evento donde puede empezar a apostar. 

Esta vista no cambia según el tipo de usuario y se puede acceder aún sin estar logueado pero al intentar unirte al chat o crear una apuesta el usuario será redirigido al login. Además, hay una barra de búsqueda que permite buscar eventos concretos de manera más rápida para el usuario basandose en los títulos de los eventos. A la izquierda, también estan las diferentes secciones agrupadas de manera que se puedan filtrar los eventos. Por ejemplo, ver solo los eventos de fútbol, de pokemon o  de concursos de baile.

Los eventos no son cargados directamente sino que se cargan de 10 en 10 con ajax según se va pulsando el botón de ver más que desaparece cuando no quedan más eventos. La lupa a su vez busca directamente en el servidor no busca entre los eventos cargados.

La vista está adaptada para modo oscuro/claro y para el uso en dispositivos móviles y al reducirse el tamaño del dispositivo aparece un nuevo menú de secciones mas compacto y fácil de usar en móvil y los eventos también pasan a verse mas compactos. (esto es para aprovechar el diseño responsif de bootstrap y el nav)

### 2. Crear apuesta
Esta vista podría considerarse la mas importante en una pagina de apuestas ya que permite apostar a un evento.

Lo primero que encontramos es una lista de todas las fórmulas ya creadas por otros usuarios junto con sus cuotas y los botones para poder apostar a favor y en contra. Las cuotas de estas fórmulas se actualizan automáticamente con WS a medida que otros usuarios van apostando. Al igual que los eventos de la [vista inicial](#1-todas-las-secciones) se cargan de 10 en 10 y la lupa busca directamente en la base de datos.

El usuario también puede crear su propia fórmula de apuesta usando las variables indicadas por el administrador. Al crear la fórmula, se obliga al usuario a hacer una primera apuesta y se verifica que los valores sean válidos. La fórmula no puede usar variables que no existe y en el servidor se hace un pequeño chequeo de que la fórmula sea válida. El chequeo consiste en confirmar un poco que no se usen operadores numéricos sobre una variable de texto pero hasta el momento en que se determina si la formula se ha cumplido o no con los datos no se puede saber si está bien hecha la fórmula. (divisiones por 0 con operación compleja en el divisor o cosas parecidas) 

Depués, a la derecha, tenemos el chat en directo del evento donde podemos ver hablar a otros usuario con WS y vemos el botón para suscribirse/desuscribirse al chat. Usando el click derecho sobre un mensaje podemos eliminarlo en el caso de que lo hayamos enviado nosotros o reportarlo en el caso de que lo haya enviado otro usuario. Los mensajes eliminados se eliminan automaticamente en la vista de otros usuarios con ws y no vuelven a aparecer al cargar la pagina. Pese a esto siguen existiendo en la BD por lo que si se elimina un mensaje que ha sido reportado los administradores pueden seguir viendolo para valorar el castigo.

La vista está adaptada para modo oscuro/claro y para vista en dispositivos moviles.

### 3. Cartera
Esta vista es lo más simple posible ya que al no haber pagos reales simplemente sirve para añdir dinero y retirarlo. Se verifica que no puedas retirar/ingresar cantidades negativas y ciertos intervalos de cantidades positivas indicadas en la vista.

### 4. Historial de apuestas
En esta vista, se ven las apuestas realizadas a una fórmula. Se clasifican las apuestas en indeterminadas, ganadas y perdidas. Las fórmulas se cargan de 10 en 10 y existen 3 pestañas para filtrar. Una muestra todas las apuestas, la segunda muestra solo las determinadas y la siguiente muestra las que aún no se han determinado. Al navegar entre pestañas, no se carga una nueva ruta sino que con JS y ajax se solicitan al servidor las apuestas del historial que cumplen con el filtro y se muestran. Esto ahorra rutas innecesarias y archivos html extra en el servidor. 

Esta vista está adaptada para el modo oscuro/claro. 

### 5. Chats
En esta vista se ven todos los chats a los que está suscrito el usuario y la cantidad de mensajes que le quedan por leer en cada uno. Los chats están ordenados según la hora de llegada del ultimo mensaje. Al seleccionar un chat, se abre a la derecha y se marcan los mensajes como leidos. Una vez abierto se ven en directo los mensajes que se van mandando. El funcionamiento para reportar/eliminar mensajes es el mismo que en [crear apuesta](#2-crear-apuesta). (Las eliminaciones de mensajes se notifican con ws)

Cada menasje muestra la foto de perfil del emisor, la hora de envio y el contenido. Si una persona envia varios mensajes seguidos se agrupan para no mostrar en cada uno la imagen y en cada cambio de dia se añade un separador para indicar la fecha.

Una vez seleccionado un evento aparece el botón de apostar que abre un offcanvas con las diferentes fórmulas a las que se puede apostar. Estas fórmulas se cargan según el evento seleccionado.

Cuando llega un mensaje de un evento que no está abierto aparece como último mensaje sin leer y se suma uno a la cantidad de mensajes no leidos de ese chat. Además, el chat se reordena en la lista de chats y se posicona arriba del todo (esto tambien pasa al mandar un mensaje en un chat).

Todos los procesos de esta vista se hacen con JS y no implican viajar a nuevas rutas haciendo así la experiencia más agradable y fluida. La vista está fuertemente adaptada para movil y también lo está para el modo claro/oscuro.

### 6. Administración
Esta vista es exclusiva para los administradores y se divide en 4 secciones que son usuarios, reportes, eventos y secciones, que son las que permiten al administrador controlar la aplicación.

#### 6.1 Usuarios
Es una tabla con todos los usuarios en la aplicación. Para cada usuario, se da la opción de ver más que lleva al perfil de ese usuario y la opción de expulsar que permite establecer una fecha hasta la que estará expulsado ese usuario.

#### 6.2 Reportes
Es una tabla con todos los reportes de la aplicación. Para cada reporte, permite ver los detalles en un modal que se carga con AJAX y revisar un reporte expulsando si necesario al usuario emisor del mensaje. (revisar se hace en un modal también)

#### 6.3 Eventos
Esta es de las vistas mas complejas de administrador ya que muestra la tabla de eventos y permite:
- **Creación de evento**: Es un modal que crea un nuevo evento eligiendo su sección, la fecha en que ocurrirá (tiene que ser posterior a la fecha actual), añadiendo etiquetas (tiene que haber más de 1) y añadiendo las variables (tiene que haber más de 1).
- **Editar evento**: Permite editar un evento ya existente. Se puede modificar la fecha, modificar las etiquetas y añadir variables (no se pueden eliminar las ya existentes).
- **Cancelar evento**: un simple modal de confirmación.
- **Determinar evento**: solo se puede determinar un evento que ya ha ocurrido y que no ha sido determinado aún. Es un enlace aparte donde el administrador tiene que introducir el valor de todas las variables asociadas al evento.

#### 6.4 Secciones
En esta parte de la aplicación es donde se realiza todo lo relacionado con las secciones, que sirven como plantilla para la creación de eventos. En todas las vista relacionadas tenemos, a la izquierda, un listado vertical de todas las secciones disponibles de la aplicación. Desde este listado, usando click derecho, se puede acceder a un menú que permite editar una sección o eliminarla. Si clickas con el botón derecho sobre el nombre de la sección, también te lleva al editar de esa sección. La parte derecha de las vistas depende si se está en la pantalla principal de secciones, creando o editando una sección. Acciones posibles:
- **Eliminar una sección**: Es un modal que muestra un mensaje de confirmación sobre la eliminación ese sección. La acción realmente es desactivar la sección en la BBDD.
- **Editar una sección**: Permite editar todos los campos de la sección menos el nombre que se considera fijo. Estos campos son: el tipo, la imagen representativa y las variables de sección. Estas variables se pueden ir eliminando y creando, esto último se hace con un modal que solicita los dos campos de las variables.
- **Crear una sección**: sería como el formulario de editar pero con todos los campos vacíos.

## 🗄️Modelo de la base de datos {#modelo-de-la-base-de-datos}
![Diagrama de BD](ER_IW.svg)

## 🌐Rutas de la Aplicación
```
/
├── GET /                                  Página de inicio
├── login
│   ├── GET /login                         Login por defecto
│   └── GET /login_error                   Página de error de login
├── register
│   ├── GET /register                      Formulario de registro
│   └── POST /register                     Envío de registro
├── seccion
│   ├── GET /seccion/{id}                  Ver eventos apostables
│   ├── GET /seccion/{id}/pic              Obtener nombre imagen
│   ├── GET /seccion/cargarMas             AJAX: cargar eventos con offset
│   └── GET /seccion/buscar                AJAX: buscar eventos con offset
├── misApuestas
│   ├── GET /misApuestas                   HTML: historial de apuestas
│   └── GET /misApuestas/cargarMas         AJAX: cargar más apuestas
├── user
│   ├── GET /user/{id}                     Ver perfil (propio o ajeno)
│   ├── POST /user/editar                  AJAX: editar datos usuario
│   ├── GET /user/verificarUsername        AJAX: verificar username
│   ├── GET /user/verificarEmail           AJAX: verificar email
│   ├── POST /user/{id}                    AJAX: crear/modificar usuario
│   ├── GET /user/{id}/pic                 Obtener imagen de usuario
│   └── POST /user/{id}/pic                AJAX: cambiar imagen usuario
├── evento
│   ├── GET /evento/{id}/apostar           Página de apuestas (fórmulas)
│   ├── GET /evento/{id}/apostar/cargarMas AJAX: cargar más fórmulas
│   ├── GET /evento/{id}/apostar/buscar    AJAX: buscar fórmulas
│   ├── GET /evento/{id}/getVariables      AJAX: obtener variables
│   ├── POST /evento/apostar               AJAX: crear apuesta
│   └── POST /evento/{id}/crearFormula     AJAX: crear fórmula
├── chats
│   ├── GET /chats/                        Cargar HTML de chats
│   ├── GET /chats/cargarChats             AJAX: cargar chats suscritos
│   ├── GET /chats/cargarMensajes/{id}     AJAX: mensajes de un chat
│   ├── POST /chats/mandarMensaje/{id}     AJAX: mandar mensaje
│   ├── POST /chats/notificar/{id}         AJAX: notificar visita (ws)
│   ├── DELETE /chats/borrarMensaje/{id}   AJAX: borrar mensaje
│   ├── POST /chats/reportarMEnsaje/{id}   AJAX: reportar mensaje
│   ├── POST /chats/{id}/suscribirse       AJAX: suscribirse a chat
│   └── POST /chats/{id}/desuscribirse     AJAX: desuscribirse de chat
├── cartera
│   ├── GET /cartera/ingresar              Página inicial de cartera
│   ├── GET /cartera/paypal                Iniciar sesión en PayPal
│   ├── GET /cartera/tarjeta               Introducir tarjeta
│   ├── GET /cartera/retirar               Página para retirar
│   ├── GET /cartera/ingreso               Página para ingresar
│   ├── POST /cartera/ingresarDinero       AJAX: ingresar dinero
│   └── POST /cartera/retirarDinero        AJAX: retirar dinero
└── admin
    ├── usuarios
    │   ├── GET  /admin/usuarios                         HTML: tabla usuarios
    │   ├── POST /admin/usuarios/{id}/banear             AJAX: banear usuario
    │   └── POST /admin/usuario/{id}/ascender            AJAX: ascender usuario
    ├── eventos
    │   ├── GET /admin/eventos                           HTML: tabla eventos
    │   ├── GET /admin/eventos/determinar/{id}           HTML: determinar evento
    │   ├── GET  /admin/eventos/getVariablesSeccion/{id} AJAX: obtener variables sección
    │   ├── POST /admin/eventos/determinar/{id}          AJAX: determinar evento
    │   ├── POST /admin/eventos/cancelar/{id}            AJAX: cancelar evento
    │   ├── POST /admin/eventos/crearEvento              AJAX: crear evento
    │   └── GET  /admin/eventos/cargarDatosEvento/{id}    AJAX: cargar más datos del evento
    ├── secciones
    │   ├── GET  /admin/secciones                         HTML: tabla secciones
    │   ├── GET  /admin/secciones/{id}/editar             HTML: editar sección
    │   ├── GET  /admin/secciones-crearSeccion            HTML: crear sección
    │   ├── POST /admin/guardarSeccion                   AJAX: guardar sección
    │   ├── POST /admin/editarSeccion                    AJAX: editar sección
    │   └── DELETE /admin/eliminarSeccion/{id}           AJAX: eliminar sección
    └── reportes
        ├── GET /admin/reportes                          HTML: tabla reportes
        ├── GET /admin/reporte/{id}/determinar           AJAX: determinar castigo
        └── GET /admin/reportes/cargarDatosReporte/{id}  AJAX: cargar más datos del reporte
```
## 🔧Recursos utilizados
- https://www.web-leb.com/es/code/609 (Barra búsqueda todas las secciones. Se ha modificado un poco)

- https://chatgpt.com/ : Sobretodo para entender como funciona bootstrap, html y css. Para detectar donde están los errores más rápido y para fragmentos de código básicos.

- https://icons.getbootstrap.com/ (diferentes iconos usados en toda la web)
)

- https://getbootstrap.com/docs/5.3/components/modal/ :Para pulsar en crear mi propia apuesta y apostar. 

- https://getbootstrap.com/docs/5.3/components/collapse/ : para los menús desplegables de la navBar.

- https://getbootstrap.com/docs/5.3/components/navbar/#offcanvas : para el menú al contraerse la pagina.

- https://codepen.io/MarkBoots/pen/RwLPXgJ : Para la forma de los mensajes de chats.