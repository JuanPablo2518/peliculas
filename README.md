# Filmados!

Aplicacion para conocer mas de peliculas

![enter image description here](https://imgur.com/VdS6TJH.jpg)

# FUNCIONALIDADES

## CRUD de Peliculas, Actores y Generos

La aplicacion cuenta con un menu para administradores donde pueden ingresar peliculas, modificar y eliminar peliculas, tambien cuentan con la opcion de autocompletar el formulario de ingreso de peliculas con informacion sacada directamente de la API de TMDB

Al escribir en el formulario, se desplegaran peliculas encontradas desde la API de TMDN, usando debounce para evitar exceso de llamadas a la AP
![I](https://imgur.com/LJRT2Tw.jpg)

Se hace uso de Vuelidate para garantizar que el texto ingresado cumpla el formato requerido para la base de datos

![enter image description here](https://imgur.com/M4vr5Pw.jpg)

## Vista De Peliculas a nivel Usuario

Los usuarios podran revisar todas las peliculas que estan subidas a la base de datos, la pagina principal cuenta con cards de todas las peliculas con una vista previa de la portada, cantidad de actores, y los 3 primeros generos

![enter image description here](https://imgur.com/5eXUGNe.jpg)

Este buscador inicial cuenta con opciones para filtrar busquedas por actores, generos y nombre, ademas de una opcion para filtrar por favoritos del propio usuario, solos los usuarios con una cuenta pueden marcar favoritos

![enter image description here](https://imgur.com/lfPvB0z.jpg)

## Seccion de detalles

Dentro de la seccion de detalles de la pelicula a la cual cualquier usuario podra acceder, se encontrara gran informacion de la pelicula, como una portada, sinopsis, actores, etc,
ademas de eso tambien contara con el trailer de la pelicula y una seccion de comentarios, todos los usuarios podran ver esta seccion pero solo usuarios Logeados podran escribir comentarios y dar likes.

![enter image description here](https://imgur.com/VdS6TJH.jpg)
![enter image description here](https://imgur.com/h5PduWc.jpg)

## Login y Registro

Los usuarios cuentan con la posibilidad de crear cuentas y logearse en esas cuentas, este sistemas de cuentas esta gestionado por Firebase Auth

![enter image description here](https://imgur.com/E3opw8w.jpg)

# TECNOLOGIAS

## Framework

![enter image description here](https://imgur.com/AryiWBp.jpg) Vue: Framework principal usado en el proyecto, se hacen uso de librerias como:

- Router: enrutamiento de la aplicacion
- Pinia: Stores de la aplicacion
- toastification: generador de alertas flotantes
- Vuelidate: crea reglas para la validacion de texto en los inputs

![enter image description here](https://imgur.com/U2YJ593.jpg)Vite: Herramienta para el montaje de un servidor de desarrollo

## Backend

![enter image description here](https://imgur.com/rkw2uEW.jpg)Firebase: Base de datos no relacional usada para el proyecto, encargada del almacenamiento de peliculas, actores, generos, usuarios, reseñas, likes en este se usan elementos como:

- Firebase Auth: encargado de la autentificacion de los login y registros de cuentas
- Firebase Hosting / Github Action: Integracion para el despliegue automatico del proyecto

# Api Externa

![enter image description here](https://imgur.com/ffhfU61.jpg) TMDB: Api encargada de suministrar informacion de peliculas y actores para el autocompletado de informacion en formularios de ingreso.

# Diseño

![enter image description here](https://imgur.com/9VmqUuB.jpg)Bootstrap: Framework de css usado para estilos generales y de estructuracion de elementos.
![enter image description here](https://imgur.com/Dmq2vfI.jpg)Sass: Preprocesador de css usado para la estilizacion de elementos de forma mas concreta y ordenada (todo lo que no sea posible de estilizar con Bootstrap)

# Instalación

1. Clona el repositorio
   git clone https://github.com/JuanPablo2518/peliculas
   cd peliculas

2. Instala las dependencias

npm install

3. Corre el proyecto en modo desarrollo

npm run dev

El proyecto estará disponible en `http://localhost:5173`

# Desafios

Este es un proyecto que trabaje durante un bootcamp front end, con la guia de mi profesor, luego de terminar el bootcamp segui trabajandolo para tener una version mas completa y mejorar mis habilidades como programador, lo cual puedo decir que estoy satisfecho ya que aprendi y hice uso de nuevas cosas como el aprendizaje de bases de datos no relacionales, cruds, conexion a APIs, sistemas de autentificacion y usuarios.

# Autor

Juan Pablo Ramirez — [LinkedIn](www.linkedin.com/in/juan-pablo-ramirez-olivares-a19368313) · [Portafolio](https://github.com/JuanPablo2518/Portafolio)
