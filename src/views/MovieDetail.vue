<!-- MovieDetail Component -->

<template>
        <div class="movie-backdrop d-flex gap-5   align-items-end " :style="{backgroundImage: movie?.backdrop ? `url(${movie.backdrop})` : ''}">
          <div class="ms-5 ">
            <img :src="movie?.poster" :alt="movie?.name" class=" movie-poster" />
          </div>

          <div>
                <p class="ficha-text"><strong>Ficha de Pelicula</strong></p>

        <h1 class="mb-3">{{ movie?.name }}</h1>
        <h4 class="mb-2">{{ movie?.tagline }}</h4>

        <div class="d-flex gap-3 mb-3">
          <p><strong>{{ movie?.year }}</strong></p> 
          <p>•</p>
          <p>{{ convertMinutes(movie?.runtime)[0]}} h {{ convertMinutes(movie?.runtime)[1]}} m</p>
            <p class="d-flex"  v-for="genre in filteredGenres" :key="genre.id">
              <p class="me-3">• </p>
              <p> {{ genre.name }}</p>  
            </p>

        </div>

        <div class="d-flex gap-3">
                    <button class="btn btn-yellow d-flex gap-2 align-items-center">
            <font-awesome-icon icon="fa-solid fa-play responsive-icon" />
            <p @click="scrollToTrailer" class="mb-0">Ver Trailer</p>
          </button>
    <button class="btn btn-outline-yellow d-flex gap-2 align-items-center">
      <svg width="20" height="20" class="tmdb-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.99 29.198c2.807 0 4.708-1.896 4.708-4.708v-19.781c0-2.807-1.901-4.708-4.708-4.708h-19.979c-2.807 0-4.708 1.901-4.708 4.708v27.292l2.411-2.802v-24.49c0.005-1.266 1.031-2.292 2.297-2.292h19.974c1.266 0 2.292 1.026 2.292 2.292v19.781c0 1.266-1.026 2.292-2.292 2.292h-16.755l-2.417 2.417-0.016-0.016zM11.714 15.286h-2.26v7.599h2.26c5.057 0 5.057-7.599 0-7.599zM11.714 21.365h-0.734v-4.557h0.734c2.958 0 2.958 4.557 0 4.557zM11.276 13.854h1.516v-6.083h1.891v-1.505h-5.302v1.505h1.896zM18.75 9.599l-2.625-3.333h-0.49v7.714h1.542v-4.24l1.573 2.042 1.578-2.042-0.010 4.24h1.542v-7.714h-0.479zM21.313 19.089c0.474-0.333 0.677-0.922 0.698-1.5 0.031-1.339-0.807-2.307-2.156-2.307h-3.005v7.609h3.005c1.24-0.010 2.245-1.021 2.245-2.26v-0.036c0-0.62-0.307-1.172-0.781-1.5zM18.37 16.802h1.354c0.432 0 0.698 0.339 0.698 0.766 0.031 0.406-0.286 0.76-0.698 0.76h-1.354zM19.724 21.37h-1.354v-1.516h1.37c0.411 0 0.745 0.333 0.745 0.745v0.016c0 0.417-0.333 0.755-0.75 0.755z"/>
      </svg>
      <p class="mb-0">{{ movie?.vote_average?.toFixed(1) }} / {{ movie?.vote_count }} votos</p>
    </button>

          <button class="btn btn-outline-yellow d-flex align-items-center gap-2">
            <font-awesome-icon icon="fa-solid fa-heart responsive-icon" />
            <p class="mb-0">{{ movie?.favsCount || 0 }} Favoritos</p>
          </button>
        </div>
          </div>
        </div>

        <div class="sinopsis-section mt-5 d-flex py-5 justify-content-between align-items-start">
          <div class="w-50">
            <h2 class="mb-4"><strong>Sinopsis</strong></h2>
            <p>{{ movie?.synopsis }}</p>
          </div>

          <div class="">
            <div class="d-flex gap-5 justify-content-between mb-4">
            <div class="info-card">
              <h5 class="info-card-title">Estreno</h5>
              <h3><strong>{{ movie?.year }}</strong></h3>
            </div>
            <div class="info-card text-end">
              <h5 class="info-card-title ">Duracion</h5>
              <h3><strong>{{ convertMinutes(movie?.runtime)[0]}} h {{ convertMinutes(movie?.runtime)[1]}} m</strong></h3>
            </div>
            </div>
            <div class="d-flex gap-5 justify-content-between  ">
                      <div class="info-card">
              <h5 class="info-card-title">Presupuesto</h5>
              <h3><strong>${{ (movie?.budget / 1000000).toFixed(1) }} M</strong></h3>
            </div>
            <div class="text-end info-card">
              <h5 class="info-card-title">Recaudacion</h5>
              <h3><strong>${{ (movie?.revenue / 1000000).toFixed(1) }} M</strong></h3>
            </div>
            </div>
          </div>
        </div>

        <div class="actors-section  mb-5 p-4 rounded-4 " :class="{'expanded' : showAllActors}">
          <div class="actor-container"></div>
          <h5 class="mb-4">Reparto Principal</h5>

          <transition-group name="fade-actors" tag="div" class="d-flex flex-wrap gap-3">
            <div v-for="actor in displayedActors" :key="actor.id" class="actor-card rounded-3 mb-4">
              <img :src="actor.photo" alt="" class="actor-image rounded-3">
              <p class="text-center">{{ actor.name }}</p>
            </div>
          </transition-group>

          <button @click="showAllActors = !showAllActors" class="btn btn-outline-yellow">{{showAllActors ? 'Ver Menos' : 'Ver Reparto Completo'}}</button>
        </div>

        <div ref="trailerSection" class="trailer-section ">
                <div class="ratio ratio-16x9 shadow-sm rounded overflow-hidden">
        <iframe
          :src="'https://www.youtube.com/embed/' + trailerKey"
          title="Youtube video player"
          frameborder="0"
          allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
          "
          allowfullscreen=""
        ></iframe>
      </div>
        </div>

        <div class="my-5 review-section ">
          <div class="d-flex justify-content-between align-items-center mb-5">
                      <div>
            <h5 class="text-yellow mb-3"><strong>Comunidad</strong></h5>
            <h2 ><strong>Reseñas de la audiencia</strong></h2>
          </div>

          <div>
            <h2 class="text-yellow d-flex align-items-center gap-2">
              <font-awesome-icon icon="fa-solid fa-star responsive-icon " />
              <strong >{{ reviewMedia }} / 10</strong>
            </h2>
            <p class="text-end ">{{ reviews.length }} valoraciones</p>
          </div>
          </div>

          <div v-if="user" class="comment-area rounded-4">
            <div class="d-flex justify-content-between mb-3">
              <p class="mb-0 "><strong>Comparte tu reseña</strong></p>
              <div class="position-relative d-inline-block">
                <button @click="showRatingPopover = !showRatingPopover"  class="btn btn-outline-yellow">Tu nota: {{ rating || 1 }} / 10  <font-awesome-icon class="text-yellow" icon="fa-solid fa-star  responsive-icon " /></button>

                <div v-if="showRatingPopover" class="rating-popover shadow-lg rounded-3 p-3">
                  <div class="d-flex ">
                    <button @click="selectRating(n)" v-for="n in 10" :class="n <= rating ? 'btn-yellow' : 'btn-outline-yellow'" :key="n" class="btn btn-sm py-2 px-3 text-white rounded-0  ">{{ n }}</button>
                  </div>
                </div>
              </div>
            </div>

            <textarea v-model="newReview" style="height: 150px;" class="w-100 form-control mb-4" placeholder="¿Que te parecio la pelicula? Comparte tu opinion con los demas" ></textarea>

            <button @click="sendReview" class="btn btn-yellow">Publicar Reseña</button>
          </div>

          <div v-else class=" d-flex  justify-content-between align-items-center bg-dark border border-light-subtle border-2 p-4 rounded-4" style="border-style: dotted  !important;">
            <p class="mb-0">Inicia sesion para escribir una reseña y dejar tu valoracion</p>
            <router-link :to="`/login?redirect=/peliculas/${movie?.id}`" class="btn btn-outline-yellow btn-sm rounded-3 text-white">Iniciar sesión</router-link>
          </div>

          <div>
            <div>
              <div class="d-flex my-4 justify-content-between align-items-center   ">
                <h5 class="mb-0 ">{{ reviews.length }} reseñas</h5>
              <div class=" d-flex justify-content-center  "  >
                <button class="p-2 me-4 btn " :class=" activeFilter === 'newToOld' ? 'btn-yellow' : 'btn-outline-yellow'" @click="activeFilter = 'newToOld'">Mas nuevas</button>
                <button class="p-2 me-4 btn" :class=" activeFilter === 'oldToNew' ? 'btn-yellow' : 'btn-outline-yellow'" @click="activeFilter = 'oldToNew'">Mas antiguas</button>
                <button class="p-2 btn" :class=" activeFilter === 'likes' ? 'btn-yellow' : 'btn-outline-yellow'" @click="activeFilter = 'likes'">Mejores Valoradas</button>
              </div>
              </div>

              <div class="comment-card mb-3 rounded-4 p-4" v-for="review in sortedReviews" :key="review.id">
                <div class=" mb-3 d-flex justify-content-between">
                  <div class="d-flex align-items-center gap-2">
                 <button
                  v-if="isAdmin"
                  @click="removeReview(review.id)"
                  class="btn btn-danger btn-sm d-inline-flex align-items-center justify-content-center"
                >
                   <font-awesome-icon icon="fa-solid fa-trash-can " />
                </button>
                <p class="mb-0"><strong>{{ review.userName }}</strong></p>
                  </div>
                  <p class="text-yellow mb-0">{{ review.rating }} / 10</p>
                </div>
                <p>{{ review.comment }}</p>
                <div class="d-flex justify-content-between">
                  <p class="mb-0">
                    <button @click="toggleLike(review.id)" :class="hasLike(review.id) ? 'text-danger' : 'text-white'" class="btn btn-link p-0 border-0  shadow-none me-1"><font-awesome-icon icon="fa-solid fa-heart color-white responsive-icon"/></button>
                    {{ review.likesCount }}</p>
                  <p class="mb-0 ">{{ review.date?.toDate().toLocaleDateString() }}</p>
                </div>

              </div>
            </div>
          </div>
        </div>


  <!--
  <div v-if="loading" class="mb-5 pb-5 container animate-pulse">
    <h2 class="text-center my-5 py-5 placeholder-glow">
      <span class="placeholder col-6 py-4 rounded"></span>
    </h2>

    <div class="row justify-content-around">
      <div class="col-md-5 placeholder-glow mb-4">
        <div class="placeholder rounded w-100" style="height: 600px"></div>
      </div>

      <div class="col-md-5">
        <div class="placeholder-glow">
          <p><span class="placeholder col-4 py-3"></span></p>
          <h5 class="placeholder col-3"></h5>
          <ul class="list-group list-group-flush mb-4">
            <li class="list-group-item border-0 p-0 mb-2" v-for="n in 3">
              <span class="placeholder col-8"></span>
            </li>
          </ul>

          <h5 class="placeholder col-2"></h5>
          <p>
            <span class="placeholder col-12"></span>
            <br />
            <span class="placeholder col-10"></span>
            <br />
            <span class="placeholder col-11"></span>
          </p>

          <h5 class="placeholder col-3 mt-4"></h5>
          <div class="placeholder rounded w-100" style="height: 150px"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="mb-5 pb-5" v-else-if="movie">
    <h2 class="text-center my-5 py-5 display-5 fw-bold">
      {{ movie.name }}
    </h2>
    <div v-if="trailerKey" class="my-5">
      <h5 class="fw-bold mb-3">Tráiler oficial</h5>
      <div class="ratio ratio-16x9 shadow-sm rounded overflow-hidden">
        <iframe
          :src="'https://www.youtube.com/embed/' + trailerKey"
          title="Youtube video player"
          frameborder="0"
          allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
          "
          allowfullscreen=""
        ></iframe>
      </div>
    </div>

    <div
      v-else
      class="p-5 mb-5 containter d-flex justify-content-center align-items-center"
    >
      <h1>==== TRAILER NO DISPONIBLE ====</h1>
    </div>

    <div class="row justify-content-around me-5">
      <div class="col-5">
        <img :src="movie.poster" :alt="movie.name" class="w-100" />
      </div>
      <div class="col-5">
        <p class="mb-5 fs-1">
          <strong>Año de estreno {{ movie.year }}</strong>
        </p>
        <h5 class="fw-bold">Reparto</h5>
        <ul class="list-group list-group-flush">
          <li
            class="list-group-item"
            v-for="actor in filteredActors"
            :key="actor.id"
          >
            {{ actor.name }}
          </li>
        </ul>
        <h5 class="fw-bold">Géneros</h5>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <p v-for="genre in filteredGenres" :key="genre.id">
              {{ genre.name }}
            </p>
          </li>
        </ul>
        <h5 class="fw-bold">Cantidad de favoritos</h5>
        <p>{{ movie.favsCount }}</p>
        <h5 class="fw-bold">Sinopsis</h5>
        <p>{{ movie.synopsis }}</p>

        <div v-if="movie.backdrop">
          <h5 class="fw-bold">Imagen de fondo</h5>
          <img :src="movie.backdrop" :alt="movie.name" />
        </div>

        <h5 class="fw-bold">Presupuesto (USD)</h5>
        <p>{{ movie.budget }}</p>

        <h5 class="fw-bold">Recaudación (USD)</h5>
        <p>{{ movie.revenue }}</p>

        <h5 class="fw-bold">Duración</h5>
        <p>{{ movie.runtime }}</p>

        <h5 class="fw-bold">Frase promocional</h5>
        <p>{{ movie.tagline }}</p>

        <h5 class="fw-bold">Puntuación de TMDB (0–10)</h5>
        <p>{{ movie.vote_average }}</p>

        <h5 class="fw-bold">Cantidad de votos en TMDB</h5>
        <p>{{ movie.vote_count }}</p>
      </div>
    </div>

    <div class="text-center">
      <button @click="returning" class="btn btn-dark">Volver</button>
    </div>

    <hr class="my-5" />

    <div class="row mt-5">
      <div class="col-md-8 mx-auto">
        <h3 class="mb-4 fw-bold">
          Opiniones de la comunidad ({{ reviews.length }})
        </h3>

        <div v-if="user" class="card shadow-sm mb-5 border-0 bg-light p-4">
          <h5 class="mb-3">Escribe tu opinión.</h5>

          <div class="mb-3">
            <label class="form-label d-block text-muted small uppercase"
              >Calificación</label
            >
            <div class="btn-group" role="group">
              <button
                v-for="n in 10"
                :key="n"
                type="button"
                class="btn btn-sm"
                :class="n <= rating ? 'btn-warning' : 'btn-outline-secondary'"
                @click="rating = n"
              >
                ⭐
              </button>
            </div>
          </div>

          <div class="mb-3">
            <textarea
              class="form-control border-0"
              rows="3"
              placeholder="Escribe tu opinión acerca de esta película."
              v-model="newReview"
            ></textarea>
          </div>

          <button @click="sendReview" class="btn btn-primary px-4 float-end">
            Enviar reseña
          </button>
        </div>

        <div v-else class="alert alert-info text-center py-4 mb-5">
          <p class="mb-2">
            Para dejar una reseña, primero debes iniciar sesión.
          </p>
          <router-link
            :to="`/login?redirect=/peliculas/${movie.id}`"
            class="btn btn-outline-primary btn-sm"
            >Iniciar sesión</router-link
          >
        </div>

        <div class="d-flex gap-2 mb-3">
          <button
            class="btn btn-sm"
            :class="
              activeFilter === 'newToOld'
                ? 'btn-primary'
                : 'btn-outline-secondary'
            "
            @click="activeFilter = 'newToOld'"
          >
            Mas recientes
          </button>
          <button
            class="btn btn-sm"
            :class="
              activeFilter === 'oldToNew'
                ? 'btn-primary'
                : 'btn-outline-secondary'
            "
            @click="activeFilter = 'oldToNew'"
          >
            Mas antiguas
          </button>
          <button
            class="btn btn-sm"
            :class="
              activeFilter === 'likes' ? 'btn-primary' : 'btn-outline-secondary'
            "
            @click="activeFilter = 'likes'"
          >
            Mas likes
          </button>
        </div>

        <div
          v-if="sortedReviews.length > 0"
          class="list-group list-group-flush shadow-sm rounder border"
        >
          <div
            v-for="review in sortedReviews"
            :id="review.id"
            class="list-group-item p-4"
          >
            <div class="d-flex justify-content-between align-items-center mb-2">
              <strong class="text-primary">{{ review.userName }}</strong>
              <span class="badge bg-warning text-dark"
                >⭐ {{ review.rating }} / 10</span
              >
            </div>

            <p class="mb-1 text-secondary italic">"{{ review.comment }}"</p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">{{
                review.date?.toDate().toLocaleDateString()
              }}</small>
              <div class="d-flex gap-2">
                <p>{{ review.likesCount }}</p>
                <button
                  v-if="user"
                  @click="toggleLike(review.id)"
                  class="btn btn-primary btn-sm"
                >
                  {{ hasLike(review.id) ? "Unlike" : "Like" }}
                </button>
                <button
                  v-if="isAdmin"
                  @click="removeReview(review.id)"
                  class="btn btn-danger btn-sm"
                >
                  Borrar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5">
          <p class="text-muted">
            Aún no hay opiniones. ¡Sé el primero en comentar!
          </p>
        </div>
      </div>
    </div>
  </div>
  -->
</template>

<script setup>
// VUE Libraries
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed, TransitionGroup } from "vue";
import { useToast } from "vue-toastification";
import { onUnmounted } from "vue";
// Services
import { getTMDBTrailer } from "@/services/tmdbService";
import { getMovies } from "@/services/movieService";
import { getActors } from "@/services/actorService";
import { getGenres } from "@/services/genreService";
import {
  deleteReview,
  saveReview,
  subscribeReviews,
} from "@/services/reviewService";
import { addLike, removeLike, subscribeLikes } from "@/services/likeService";
// Store
import { useLoginStore } from "@/stores/loginStore";
import { useMoviesStore } from "@/stores/moviesStore";
// Utils
import { convertErrors } from "@/utils/errorMessages";
import { convertMinutes } from "@/utils/moviesUtils";
import { faL } from "@fortawesome/free-solid-svg-icons";
// SVG

// Composables
const route = useRoute();
const router = useRouter();
const toast = useToast();
const loginStore = useLoginStore();
const movieStore = useMoviesStore();

// Lets
let unsubscribe;
let unsubscribeLikes;

// Const
const hasLike = (reviewId) =>
  movieStore.likesId.find((l) => l.reviewId === reviewId);

// Refs
const newReview = ref("");
const activeFilter = ref("newToOld");
const rating = ref(5);

const loading = ref(true);

const reviews = ref([]);
const actors = ref([]);
const genres = ref([]);
const filteredActors = ref([]);
const filteredGenres = ref([]);

const trailerKey = ref(null);
const movie = ref(null);

// Computed
const user = computed(() => loginStore.user);
const userProfile = computed(() => loginStore.userProfile);
const isAdmin = computed(() => loginStore.role === "admin");

const reviewMedia = computed(() => {
  if (!reviews.value || reviews.value.length === 0) return 0

  const total = reviews.value.reduce((acc, review) => acc + (review.rating || 0), 0)
  const average = total / reviews.value.length;
  return Number(average.toFixed(1))
})

const showAllActors = ref(false)

const displayedActors = computed(() => {
  return showAllActors.value ? filteredActors.value : filteredActors.value.slice(0,5)
})

const trailerSection = ref(null)

const scrollToTrailer = () => {
  trailerSection.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const showRatingPopover = ref(false)

const selectRating = (n) => {
  rating.value = n; 
  showRatingPopover.value = false
}

/**
 * Function to filter reviews
 * First, it creates a copy of all the reviews at the time the function is called
 * Then, it checks the type of filter to apply using an if statement and returns the sorted list of reviews
 */
const sortedReviews = computed(() => {
  const copy = [...reviews.value];

  if (activeFilter.value === "newToOld") {
    return copy.sort((a, b) => b.date?.toMillis() - a.date?.toMillis());
  } else if (activeFilter.value === "oldToNew") {
    return copy.sort((a, b) => a.date?.toMillis() - b.date?.toMillis());
  } else if (activeFilter.value === "likes") {
    return copy.sort((a, b) => (b.likesCount ?? 0) - (a.likesCount ?? 0));
  } else {
    return copy;
  }
});

// Lifecycle hooks

/**
 * onMounted method used to initialize data
 * Uses the subscribeReviews method to update comments in real time
 * Additionally, it uses the filter method to find the corresponding actors and genres for each movie
 */
onMounted(async () => {
  await loadData();

  unsubscribe = subscribeReviews(route.params.id, (data) => {
    reviews.value = data;
  });

  if (loginStore.user) {
    unsubscribeLikes = subscribeLikes(loginStore.user.uid, (likes) => {
      movieStore.setLikes(likes);
    });
  }

  filteredActors.value =
    actors.value.filter((actor) => movie.value.actors.includes(actor.id)) || [];
  filteredGenres.value =
    genres.value.filter((genre) => movie.value.genres.includes(genre.id)) || [];
});

// Method to unsubscribe when the component is unmounted
onUnmounted(() => {
  if (unsubscribe) unsubscribe();
  if (unsubscribeLikes) unsubscribeLikes();
});

// Methods

// Method to return to the movies menu
const returning = () => {
  router.back();
};

/**
 * Method to load all data for the selected movie to view its details
 * First, it uses a find method to locate the movie based on the movie ID from the page route
 * Then it retrieves the actors and genres data
 * If the movie has a tmdbId, its trailer will be fetched
 * In case of an error, a toast will be shown to the user
 */

const loadData = async () => {
  try {
    loading.value = true;
    const movies = await getMovies();
    movie.value = movies.find((p) => p.id === route.params.id);

    if (!movie.value) {
      toast.error("La película no existe.");
      router.push("/peliculas");
      return;
    }

    actors.value = await getActors();
    genres.value = await getGenres();

    if (movie.value.tmdbId) {
      trailerKey.value = await getTMDBTrailer(movie.value.tmdbId);
    }
  } catch (error) {
    toast.error("Error al cargar los datos: " + convertErrors(error));
  } finally {
    loading.value = false;
  }
};

const removeReview = async (id) => {
  if (!confirm("¿Seguro/a de que desea eliminar esta reseña?")) return;
  await deleteReview(id);
  toast.success("Reseña eliminado correctamente.");
};

/**
 * Method to publish a new review
 * First, it checks that the review is not empty, returning null if it is
 * Then it uses the saveReview method to publish the review with the required data
 * In case of an error, a toast with the error will be shown to the user
 */
const sendReview = async () => {
  if (reviews.value.find((u) => u.userId === user.value.uid)) {
    toast.warning("Ya has escrito una reseña en esta pelicula.");
    return;
  }

  if (newReview.value.trim() === "") {
    toast.warning("Ingrese texto al campo de reseña.");
    return;
  }

  try {
    await saveReview({
      movieId: route.params.id,
      userId: user.value.uid,
      userName: userProfile.value.name,
      rating: rating.value,
      comment: newReview.value,
    });

    newReview.value = "";
    rating.value = 5;
    toast.success("¡Gracias por tu opinión!");
  } catch (error) {
    toast.error("Error al publicar la reseña: " + convertErrors(error));
  }
};

/**
 * Function to add or remove a like from a review
 * First, it checks if there is an active user, and if not, it displays an error toast
 * Then, it uses the hasLike method to check whether the review already has a like
 * If it does, it removes the like, and if not, it adds it
 */

const toggleLike = async (reviewId) => {
  const user = loginStore.user;

  if (!user) {
    toast.warning("¡Debes iniciar sesión para darle me gusta a los mensajes!");
    return;
  }
  const like = hasLike(reviewId);

  if (like) {
    await removeLike(like.id, reviewId);
  } else {
    await addLike(user.uid, reviewId);
  }
};
</script>

<style scoped lang="scss">
@use "sass:color";

@use "@/assets/scss/abstracts/variables" as *;
@use "@/assets/scss/abstracts/mixins" as *;

.movie-backdrop {
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  min-height: 400px;
  background-size: cover;
  background-repeat: no-repeat;
  padding: 150px 50px;
}

.movie-backdrop::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to left, rgba(0, 0, 0, 0.1) 0%, rgb(26, 26, 26) 100%);
  z-index: 1;
}

.movie-backdrop > * {
position: relative;
z-index: 2;
}

.movie-poster {
  width: 250px;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.ficha-text {
  color: $primary-color;
  letter-spacing: 1px;
}

.tmdb-icon {
  fill: $primary-color;
  transition: fill 0.2s ease;
}

.btn-outline-yellow:hover .tmdb-icon {
  fill: color.adjust($primary-color, $lightness: -10%) 
}

.info-card {
  background-color: color.adjust($secondary-color, $lightness: -8%);
  border: 1px solid rgba($primary-color, 0.4);
  padding: 20px;
  border-radius: 8px;
  width: 175px;
}

.info-card-title {
  color: $primary-color;
}

.actors-section {
  width: 65%;
  background-color: color.adjust($secondary-color, $lightness: 12%);
  max-height: 360px;
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.actors-section h5 {
  color: $primary-color;
}

.actors-section.expanded {
  max-height: 2500px; 
}

.fade-actors-enter-active, .fade-actors-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease
}

.fade-actors-enter-from, .fade-actors-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-actors-move {
  transition: transform 0.4s ease;
}

.trailer-section {
  margin-top: 120px;
}

.actor-card {
  height: 200px;
  width: 140px;
  background-color: rgb(32, 30, 30);
}

.actor-image {
  height: 140px;
  width: 100%;
  object-fit: cover;
  object-position: center 15%;
}

.comment-area {
  background-color: color.adjust($secondary-color, $lightness: 10%);
  padding: 20px;
  border: 1px solid rgba($primary-color, 0.4);
}

.rating-popover {
  position: absolute;
  bottom: 125%;
  right: 0;
  background-color: color.adjust($secondary-color, $lightness: -5%);
  border: 1px solid rgba($primary-color, 0.4);
  z-index: 100;
}

.comment-card {
  background-color: color.adjust($secondary-color, $lightness: 10%);
}

</style>
