<!-- MoviesView -->

<template>
  <!-- Skeleton Loader -->
  <div v-if="loading" class="container animate-pulse">
    <h2 class="text-center my-5 py-5 placeholder-glow">
      <span class="placeholder col-6 py-4 rounded"></span>
    </h2>

    <div class="row">
      <div v-for="n in 8" :key="n" class="col-md-3 mb-5">
        <div class="placeholder rounded w-100" style="height: 600px"></div>
        <div class="placeholder-glow mt-3">
          <span class="placeholder col-8"></span>
          <span class="placeholder col-4"></span>
        </div>
      </div>
    </div>
  </div>

  <div v-else>

        <div class="modal" id="selectModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <SearchSelectModal v-if="inputSelection === 'actor'" :data="actors" :movies="movies" :type="inputSelection" @save="selectValues" />
      <SearchSelectModal v-else :data="genres" :movies="movies" :type="inputSelection" @save="selectValues" />
    </div>
  </div>
    <!-- Title -->
    <h1 class="text-center my-5 fw-bold display-5">Peliculas!</h1>
    <!-- Search Filters -->
    <div class="row my-5 g-3">
      <div class="col-md-12">
        <!-- Search by name -->
        <input
          type="text"
          class="form-control form-control-lg shadow-sm "
          placeholder="Buscar peliculas"
          v-model="searchQuery"
        />
        <!-- Favorites Filter -->
         <div class="d-flex gap-4 ">
                  <button
                  
          @click="toggleFavorites"
          class="btn  fav-button  align-items-center w-50 py-2 mt-3 px-4 d-flex gap-3 "
        >
        <font-awesome-icon icon="fa-solid fa-star responsive-icon" class="action-icon"  />
          <p class="mb-0">Mostrar Favoritos</p>
        </button>

              <button
              data-bs-toggle="modal"
            data-bs-target="#selectModal"
          @click="inputSelection = 'actor'"
          class="btn  btn-outline-light  align-items-center w-25  justify-content-between  mt-3 px-3 d-flex gap-3"
        >
        <div class="d-flex gap-3 align-items-center">
          <font-awesome-icon icon="fa-solid fa-user responsive-icon" class="action-icon  "  />
          <p class="mb-0">Filtrar Actores</p>
        </div>

        <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square responsive-icon" class="action-icon  "  />
        </button>

                <button
                data-bs-toggle="modal"
            data-bs-target="#selectModal"
          @click="inputSelection = 'genre'"
          class="btn  btn-outline-light  align-items-center w-25  mt-3 px-3 d-flex justify-content-between gap-3"
        >
        <div class="d-flex gap-3 align-items-center">
          <font-awesome-icon icon="fa-solid fa-masks-theater responsive-icon" class="action-icon  "  />
          <p class="mb-0" >Filtrar Generos</p>
        </div>
          <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square responsive-icon" class="action-icon  "  />
        </button>
         </div>
      </div>

      <!-- <div class="col-md-3">
        <select
          class="form-select form-select-lg shadow-sm"
          multiple
          v-model="selectedGenre"
        >
          <option value="">Todos los géneros</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
      </div>

      <div class="col-md-3">
        <select
          class="form-select form-select-lg shadow-sm"
          multiple
          v-model="selectedActor"
        >
          <option value="">Todos los actores</option>
          <option v-for="actor in actors" :key="actor.id" :value="actor.id">
            {{ actor.name }}
          </option>
        </select>
      </div> -->
    </div>

    <!-- Movies Container -->
    <div class="row">
      <div
        v-if="filterMovies.length > 0"
        class="col-md-6 col-lg-4 col-xl-3 mb-5"
        v-for="movie in filterMovies"
        :key="movie.id"
      >
        <MovieCard
          :movie="movie"
          :genres="getGenreNames(movie)"
        ></MovieCard>
      </div>
      <!-- Container displayed when no movies match the filters -->
      <div v-else class="text-center my-5">
        <h3 class="text-muted">
          No se encontraron películas con esos filtros 🍿
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup>
// VUE Libraries
import { ref, onMounted, watch, computed, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
// Components
import MovieCard from "@/components/MovieCard.vue";
// Services
import {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  subscribeMovies,
} from "@/services/movieService";
import { getActors } from "@/services/actorService";
import { getGenres } from "@/services/genreService";
// Stores
import { useMoviesStore } from "@/stores/moviesStore";
// Utils
import { convertErrors } from "@/utils/errorMessages";
import SearchSelectModal from "@/components/SearchSelectModal.vue";


// Composables
const moviesStore = useMoviesStore();
const toast = useToast();

// Let
let unsubscribe;

// Refs
const movies = ref([]);
const actors = ref([]);
const genres = ref([]);
const searchQuery = ref("");
const selectedGenre = ref("");
const selectedActor = ref("");
const inputSelection = ref("")

const showingFavorites = ref(false);
const loading = ref(true);

// Computed



const filterMovies = computed(() => {
  return movies.value.filter((movie) => {
    const matchesName = movie.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesGenre =
      !selectedGenre.value ||
      selectedGenre.value.every((g) => movie.genres.includes(g));
    const matchesActor =
      !selectedActor.value ||
      selectedActor.value.every((a) => movie.actors.includes(a));
    const matchesFavorite =
      !showingFavorites.value || moviesStore.favoritesId.includes(movie.id);

    return matchesName && matchesGenre && matchesActor && matchesFavorite;
  });
});

const selectValues = (data) => {
    if (inputSelection.value === 'actor') selectedActor.value = data
  else selectedGenre.value = data
}

// Lifecycle hooks

// Method to start the subscription that updates data in real time when the component is mounted

onMounted(() => {
  unsubscribe = subscribeMovies((data) => {
    movies.value = data;
  });
  loadData();
});

// Method to unsubscribe when the component is unmounted

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

// Methods



// Method to toggle between showing and not showing favorites

const toggleFavorites = async () => {
  showingFavorites.value = !showingFavorites.value;
  console.log(filterMovies.value);
};

/**
 * Method to delete Movies from the database
 * First, it shows a message to confirm whether the user wants to delete the data
 * If so, it deletes the data from the database and notifies the user
 */

const deleteData = async (id) => {
  if (!confirm("¿Seguro/a de que desea eliminar esta película?")) return;
  await deleteMovie(id);
  toast.success("Película eliminada correctamente.");
};

/**
 * Method to load data
 * Loads actors and genres information from the database
 * In case of an error, it will display a toast to the user
 */

const loadData = async () => {
  try {
    loading.value = true;
    actors.value = await getActors();
    genres.value = await getGenres();
  } catch (error) {
    toast.error("Error al cargar los datos: " + convertErrors(error));
  } finally {
    loading.value = false;
  }
};

const getGenreNames = (movie) => {
  const genresMatches = [];

  movie.genres.forEach((ge) => {
    const genreFound = genres.value.find((g) => g.id === ge);

    if (genreFound) {
      genresMatches.push(genreFound.name);
    }
  });

  return genresMatches;
};
</script>

<style scoped lang="scss">
@use "sass:color";
@use "@/assets/scss/abstracts/variables" as *;
@use "@/assets/scss/abstracts/mixins" as *;


.fav-button {
  background-color: $primary-color;

  &:hover {
    background-color: color.adjust($primary-color, $lightness: -5%);
  }
}

.actor-button {
  background-color: color.adjust($color: rgb(252, 92, 92),  $lightness: -20%)
}

.genre-button {
  background-color: rgb(119, 235, 119);
}

.btn-outline-light {
  p {
    color: inherit;
  }
}
</style>
