# Filmados!

Aplicación para conocer más sobre películas: explora un catálogo, revisa detalles, deja comentarios y marca tus favoritas.

![Vista principal de Filmados](https://imgur.com/VdS6TJH.jpg)

🔗 [Demo en vivo](https://peliculas-843ab.web.app/peliculas) · 📁 [Repositorio](https://github.com/JuanPablo2518/peliculas)

## Funcionalidades

### CRUD de Películas, Actores y Géneros

La aplicación cuenta con un menú para administradores donde pueden ingresar, modificar y eliminar películas. También cuentan con la opción de autocompletar el formulario de ingreso con información obtenida directamente desde la API de TMDB.

Al escribir en el formulario se despliegan las películas encontradas en la API de TMDB, usando _debounce_ para evitar el exceso de llamadas mientras el usuario escribe.

![Autocompletado de películas desde la API de TMDB](https://imgur.com/LJRT2Tw.jpg)

Se hace uso de Vuelidate para garantizar que el texto ingresado cumpla el formato requerido por la base de datos.

![Validación de formularios con Vuelidate](https://imgur.com/M4vr5Pw.jpg)

### Vista de películas a nivel usuario

Los usuarios pueden revisar todas las películas subidas a la base de datos. La página principal cuenta con tarjetas (cards) de cada película, con una vista previa de la portada, cantidad de actores y los primeros 3 géneros.

![Catálogo de películas en tarjetas](https://imgur.com/5eXUGNe.jpg)

El buscador inicial permite filtrar por actores, géneros y nombre, además de una opción para filtrar por favoritos del propio usuario. Solo los usuarios con cuenta pueden marcar favoritos.

![Filtros de búsqueda por actor, género y favoritos](https://imgur.com/lfPvB0z.jpg)

### Sección de detalles

Cualquier usuario puede acceder a la sección de detalles de una película, donde encontrará información completa: portada, sinopsis, actores, tráiler y una sección de comentarios. Todos los usuarios pueden ver los comentarios, pero solo los usuarios con sesión iniciada pueden escribir comentarios y dar likes.

![Página de detalle de una película](https://imgur.com/VdS6TJH.jpg)
![Sección de comentarios y likes](https://imgur.com/h5PduWc.jpg)

### Login y registro

Los usuarios pueden crear cuentas e iniciar sesión. Este sistema está gestionado por Firebase Auth.

![Pantalla de login y registro](https://imgur.com/E3opw8w.jpg)

## Tecnologías

### Framework

![Logo de Vue](https://imgur.com/AryiWBp.jpg)

**Vue**: framework principal usado en el proyecto, junto con librerías como:

- **Router**: enrutamiento de la aplicación
- **Pinia**: manejo de stores de la aplicación
- **Vue Toastification**: generador de alertas flotantes
- **Vuelidate**: reglas de validación para los inputs

![Logo de Vite](https://imgur.com/U2YJ593.jpg)

**Vite**: herramienta usada para el servidor de desarrollo y el build de producción.

### Backend

![Logo de Firebase](https://imgur.com/rkw2uEW.jpg)

**Firebase**: base de datos no relacional usada en el proyecto, encargada del almacenamiento de películas, actores, géneros, usuarios, reseñas y likes. Se hace uso de:

- **Firebase Auth**: autenticación de login y registro de cuentas
- **Firebase Hosting + GitHub Actions**: integración para el despliegue automático del proyecto

### API externa

![Logo de TMDB](https://imgur.com/ffhfU61.jpg)

**TMDB**: API encargada de suministrar información de películas y actores para el autocompletado en los formularios de ingreso.

### Diseño

![Logo de Bootstrap](https://imgur.com/9VmqUuB.jpg)

**Bootstrap**: framework de CSS usado para estilos generales y estructuración de elementos.

![Logo de Sass](https://imgur.com/Dmq2vfI.jpg)

**Sass**: preprocesador de CSS usado para estilizar elementos de forma más concreta y ordenada, en todo lo que no cubre Bootstrap.

## Instalación

1. Clona el repositorio

   ```bash
   git clone https://github.com/JuanPablo2518/peliculas.git
   cd peliculas
   ```

2. Instala las dependencias

   ```bash
   npm install
   ```

3. Configura las variables de entorno

   ```bash
   cp .env.example .env
   ```

   Completa el archivo `.env` con tus propias claves (API key de TMDB y configuración de Firebase):

   ```
    VITE_FIREBASE_API_KEY=
    VITE_FIREBASE_AUTH_DOMAIN=
    VITE_FIREBASE_PROJECT_ID=
    VITE_FIREBASE_STORAGE_BUCKET=
    VITE_FIREBASE_MESSAGING_SENDER_ID=
    VITE_FIREBASE_APP_ID=


    VITE_TMDB_API_KEY=
   ```

4. Corre el proyecto en modo desarrollo
   ```bash
   npm run dev
   ```
   El proyecto estará disponible en `http://localhost:5173`

## Desafíos

Este proyecto lo trabajé durante un bootcamp de front end, con la guía de mi profesor. Luego de terminar el bootcamp seguí desarrollándolo por mi cuenta para tener una versión más completa y mejorar mis habilidades como programador. Estoy satisfecho con el resultado, ya que aprendí y apliqué cosas nuevas como el uso de bases de datos no relacionales, CRUDs, conexión a APIs externas y sistemas de autenticación de usuarios.

## Autor

Juan Pablo Ramírez — [LinkedIn](https://www.linkedin.com/in/juan-pablo-ramirez-olivares-a19368313) · [Portafolio](https://github.com/JuanPablo2518/Portafolio)
