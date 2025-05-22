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
- [Recursos utilizados](#recursos-utilizados)

## Cómo ejecutar

#### Requisitos previos
- Java 21 o superior instalado.
- Maven instalado.

#### Pasos para ejecutar el proyecto

1. **Clonar el repositorio**

```bash
git https://github.com/abrahaamg/GOLD2WIN
cd GOLD2WIN
```

2. **Compilar el proyecto**
```bash
mvn clean install
```

3. **Ejecutar la apliacción**
```bash
mvn spring-boot:run
```

4. **Abrir la aplicacion**
Busca https://localhost:8080 en el navegador.

## Descripción del proyecto
Gold2Win es una casa de apuestas en la cual se puede apostar a diferentes eventos que se pueden ir añadiendo. Estos eventos se clasifican en secciones como deportes, esports, juegos de mesa o cualquier cosa imaginable. 

Cada evento lleva asociadas una serie de variables como por ejemplos (goles-barcelona) con las que los apostadores pueden crear sus propias formulas y apostar a ellas. Las cuotas se calculan dinámicamente según cuanto dinero se ha apostado a favor y en contra de la formula quedandose un pequeño porcentaje la página por sus servicios. Los eventos también llevan asociados etiquetas que sirven para resaltar cosas importantes del evento como la competición, la ronda, los equipos, etc. Los eventos llevan asociada la fecha en que se van a llevar a cabo y una vez llevados a cabo un administrador debe encargarse de determinar como ha sucedido el evento. Es decir dar valores a las variables previamente definidas para poder determinar automáticamente que formulas se han cumplido y poder repartir el dinero entre los apostadores. 

Las secciones además de para clasificar los eventos llevan asociada una plantilla de variables recurrentes en los eventos de esa sección. Esto sirve para facilitar la tarea de los administradores que tendrán que crear los eventos.

Cada usuario tendrá acceso a un historial donde ver las diferentes apuestas que ha realizado así como su estado (ganadas, perdidas, indeterminadas).

Además se implementa un sistema de chats grupales asociado a cada evento donde los usuarios pueden apostar y hablar sobre el evento. Un usuario puede hablar por el chat sin estar suscrito y si se suscribe el chat aparecerá de manera más accesible en la pestaña de chats indicandole cuantos mensajes le quedan por leer y recibiendo notificaciones al llegar mensajes nuevos. Para evitar problemas en los chats los usuarios pueden reportar un mensaje pulsando click derecho y un administrador es el encargado de revisar el mensaje y aplicar una sanción si lo considera necesario. Las sanciones son expulsiones temporales que una vez aplicada a un usuario este cierra sesión automáticamente y no se le permite volver a iniciarla hasta que haya pasado el tiempo de expulsión.

Las cuentas se dividen en 2 tipos:
- **Usuarios**: Esta es la cuenta estandar con la cual el usuario puede crear formulas de apuesta, apostar, chatear, reportar, ver perfiles de otros usuarios, ver su historico y acceder al perfil de otro usuario.
- **Administrador**: Este usuario tiene las mismas funciones que un usuario normal pero además puede acceder a la zona de administración donde puede ver la lista de usuarios, reportes, eventos y secciones. Puede expulsar a un usuario, indicar que se ha revisado un reporte aplicando la penalización necesaria, crear un evento, editar un evento ya creado, cancelar un evento (esto devuelve todo el dinero a los usuarios), ver los detalles de un evento, crear una sección y editar las ya existentes. 


## Vistas
### 1. Todas las secciones
Es la recepción de la página y donde se pueden ver todos los eventos apostables que aún no han ocurrido. En cada uno se ve el titulo, la fecha, imagen de a sección, las etiquetas y un botón para unirse al chat de texto e ir a verlo. Pulsando sobre los eventos el usuario es redirigido a la pagina de crear apuesta del evento donde puede empezar a apostar. 

Esta vista no cambia según el tipo de usuario y se puede acceder aún sin estar logueado pero al intentar unirte al chat o crear una apuesta el usuario será redirigido al login. Además hay una barra de busqueda que permite buscar eventos concretos de manera más rapida para el usuario basandose en los titulos de los eventos. A la hizquierda también estan las diferentes secciones agrupadas de manera que se puedan filtrar los eventos. Por ejemplo ver solo los eventos de footbol, de pockemon o  de concursos de baile.

Los eventos no son cargados directamente sino que se cargan de 10 en 10 con ajax según se va pulsando el boton de ver más que desaparece cuando no quedan más evento. La lupa a su vez busca directamente en el servidor no busca entre los eventos cargados.

La vista está adaptada para modo oscuro/claro y para el uso en dispositivos móviles y al reducirse el tamaño del dispositivo aparece un nuevo menú de secciones mas compacto y facil de usar en movil y los eventos también pasan a verse mas compactos. (esto es para aprovechar el diseño responsif de bootstrap y el nav)

### 2. Crear apuesta
Esta vista podría considerarse la mas importante en una pagina de apuestas ya que permite apostar a un evento.

Lo primero que encontramos es una lista de todas las formulas ya creadas por otros usuarios junto con sus cuotas y los botones para poder apostar a favor y en contra. Las cuotas de estas formulas se actualizan automáticamente con WS a medida que otros usuarios van apostando. Al igual que los eventos de la [vista inicial](#1-todas-las-secciones) se cargan de 10 en 10 y la lupa busca directamente en la base de datos.

El usuario también puede crear su propia formula de apuesta usando las variables indicadas por el administrador. Al crear la formula se obliga al usuario a hacer una primera apuesta y se verifica que los valores sean validos. La formula no puede usar variables que no existe y en el servidor se hace un pequeño chequeo de que la formula sea valida. El chequeo consiste en confirmar un poco que no se usen operadores numericos sobre una variable de texto pero hasta el momento en que se determina si la formula se ha cumplido o no con los datos no se puede saber si está bien hecha la formula. (divisiones por 0 con operacion compleja en el diviso o cosas parecidas) 

Depués a la derecha tenemos el chat en directo del evento donde podemos ver hablar a otros usuario con WS y vemos el boton para suscribirse/desuscribirse al chat. Usando el click derecho sobre un mensaje podemos eliminarlo en el caso de que lo hayamos enviado nosotros o reportarlo en el caso de que lo haya enviado otro usuario. Los mensajes eliminados se eliminan automaticamente en la vista de otros usuarios con ws y no vuelven a aparecer al cargar la pagina. Pese a esto siguen existiendo en la BD por lo que si se elimina un mensaje que ha sido reportado los administradores pueden seguir viendolo para valorar el castigo.

La vista está adaptada para modo oscuro/claro y para vista en dispositivos moviles.

### 3. Cartera
Esta vista es lo más simple posible ya que al no haber pagos reales simplemente sirve para añdir dinero y retirarlo. Solo se verifica que no puedas retirar/ingresar cantidades negativas.

### 4. Historial de apuestas
En esta vista se ven las apuestas realizadas a una formula. Se clasifican las apuestas en indeterminadas, ganadas y perdidas. Las formulas se cargan de 10 en 10 y existen 3 pestañas para filtrar. Una muestra todas las apuestas, la segunda muestra solo las determinadas y la siguiente muestra las que aún no se han determinado. Al navegar entre pestañas no se carga una nueva ruta sino que con JS y ajax se solicitan al servidor las apuestas del historial que cumplen con el filtro y se muestran. Esto ahorra rutas innecesarias y archivos html extra en el servidor. 

Esta vista está adaptada para el modo oscuro/claro. 

### 5. Chats
En esta vista se ven todos los chats a los que está suscrito el usuario y la cantidad de mensajes que le quedan por leer en cada uno. Los chats están ordenados según la hora de llegada del ultimo mensaje. Al seleccionar un chat se abre a la derecha y se marcan los mensajes como leidos. Una vez abierto se ven en directo los mensajes que se van mandando. El funcionamiento para reportar/eliminar mensajes es el mismo que en [crear apuesta](#2-crear-apuesta). (Las eliminaciones de mensajes se notifican con ws)

Cada menasje muestra la foto de perfil del emisor, la hora de envio y el contenido. Si una persona envia varios mensajes seguidos se agrupan para no mostrar en cada uno la imagen y en cada cambio de dia se añade un separador para indicar la fecha.

Una vez seleccionado un evento aparece el botón de apostar que abre un offcanvas con las diferentes formulas a las que se puede apostar. Estas formulas se cargan según el evento seleccionado.

Cuando llega un mensaje de un evento que no está abierto aparece como ultimo mensaje sin leer y se suma uno a la cantidad de mensajes no leidos de ese chat. Además el chat se reordena en la lista de chats y se posicona arriba del todo (esto tambien pasa al mandar un mensaje en un chat).

Todos los procesos de esta vista se hacen con JS y no implican viajar a nuevas rutas haciendo así la experiencia más agradable y fluida. La vista está fuertemente adaptada para movil y también lo está para el modo claro/oscuro.

### 6. Administración
Esta vista es exclusiva para los administradores y se divide en 4 secciones que son usuarios, reportes, eventos y secciones. Que son las que permiten al administrador controlar la aplicación.

#### 6.1 Usuarios
Es una tabla con todos los usuarios en la aplicación. Para cada usuario se da la opción de ver más que lleva al perfil de ese usuario y la opción de expulsar que permite establecer una fecha hasta la que estará expulsado ese usuario

#### 6.2 Reportes
Es una tabla con todos los reportes de la aplicación. Para cada reporte permite ver los detalles en un modal que se carga con AJAX y revisar un reporte expulsando si necesario al usuario emisor del mensaje. (revisar se hace en un modal también)

#### 6.3 Eventos
Esta es de las vistas mas complejas de administrador ya que muestra la tabla de eventos y permite permite:
- **Creación de evento**: Es un modal que crea un nuevo evento eligiendo su sección, la fecha en que ocurrirá (tiene que ser posterior a la fecha actual), añadiendo etiquetas (tiene que haber más de 1) y añadiendo las variables (tiene que haber más de 1).
- **Editar evento**: Permite editar un evento ya existente. Se puede modificar la fecha, modificar las etiquetas y añadir variables (no se pueden eliminar las ya existentes).
- **Cancelar evento**: un simple modal de confirmación.
- **Determinar evento**: solo se puede determinar un evento que ya ha ocurrido y que no ha sido determinado aún. Es un enlace aparte donde el administrador tiene que introducir el valor de todas las variables asociadas al evento.

#### 6.4 Secciones
El administrador puede añadir una nueva sección o editar una sección poniendo la imagen de perfil, el grupo de secciones al que pertenece y poniendo las variables de la plantilla.

-----------------------------

## Modelo de la base de datos
![Diagrama de BD](ER_IW.svg)

## Recursos utilizados
- https://www.web-leb.com/es/code/609 (Barra busqueda todas las secciones. Se ha modificado un poco)

- https://chatgpt.com/ : Sobretodo para entender como funciona bootstrap, html y css. Para detectar donde están los errores más rápido y para fragmentos de código basicos.

- https://icons.getbootstrap.com/ (diferentes iconos usados en toda la web
)

- https://getbootstrap.com/docs/5.3/components/modal/ :Para pulsar en crear mi propia apuesta y apostar. 

- https://getbootstrap.com/docs/5.3/components/collapse/ : para los menús desplegables de la navBar

- https://getbootstrap.com/docs/5.3/components/navbar/#offcanvas : para el menú al contraerse la pagina.

- https://codepen.io/MarkBoots/pen/RwLPXgJ : Para la forma de los mensajes de chats
