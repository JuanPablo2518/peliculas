<!-- MoviesForm Component
This component is used to create and update movies in the database
It also includes buttons that display the forms for adding actors and genres -->

<template>


    <div class="modal" id="selectModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <SearchSelectModal v-if="inputSelection === 'actor'" :data="props.actors" :movies="movies" :type="inputSelection" @save="selectValues" />
      <SearchSelectModal v-else :data="props.genres" :movies="movies" :type="inputSelection" @save="selectValues" />
    </div>
  </div>

  <TMDBInput :type="'Movie'" @select="insertMovie" />

  <form
    @submit.prevent="submitForm"
    class="mb-4 p-4 d-flex flex-column align-items-center justify-content-center"
  >
    <div class="p-4 w-100 w-lg-75 movies-form justify-content-end">
      <label class="form-label movies-label">Nombre</label>
      <div class="d-flex flex-column flex-md-row align-items-md-start gap-3">
        <div class="flex-grow-1">
          <input
            type="text"
            class="form-control   w-100"
            :class="{ 'is-invalid': v$.name.$error }"
            v-model="name"
          />
          <div v-if="v$.name.$dirty"></div>
          <div class="invalid-feedback" v-if="v$.name.required.$invalid">
            Por favor, ingrese un nombre
          </div>
          <div class="invalid-feedback" v-if="v$.name.minLength.$invalid">
            El nombre debe ser de al menos
            {{ v$.name.minLength.$params.min }} caracteres.
          </div>
          <!-- <p class="form-label actors-label mt-2" v-if="resetTMDBPopularity">El campo "Popularidad TMDB" a sido eliminado: <a class="text-decoration-underline" style="cursor:pointer" @click="restoreTMDB" >Reestablecer</a></p> -->
        </div>
      </div>

      <label class="form-label movies-label mt-4">Año</label>
      <div class="d-flex flex-column flex-md-row align-items-md-start gap-3">
        <div class="flex-grow-1">
          <input
            type="number"
            step="1"
            @keydown="
              ['.', ','].includes($event.key) && $event.preventDefault()
            "
            class="form-control   w-100"
            :class="{ 'is-invalid': v$.year.$error }"
            v-model="year"
          />
          <div class="invalid-feedback" v-if="v$.year.required.$invalid">
            Este campo es obligatorio
          </div>
          <div
            class="invalid-feedback"
            v-else-if="v$.year.between.$invalid && !v$.year.integer.$invalid"
          >
            Ingrese un valor entre 1900 y {{ v$.year.between.$params.max }}.
          </div>
        </div>
      </div>

      <label class="form-label movies-label mt-4">Poster</label>
      <div class="d-flex flex-column flex-md-row align-items-md-start gap-3">
        <div class="flex-grow-1">
          <input
            type="text"
            class="form-control   w-100"
            :class="{ 'is-invalid': v$.poster.$error }"
            v-model="poster"
          />
          <div class="invalid-feedback" v-if="poster && v$.poster.url.$invalid">
            Ingrese una URL válida
          </div>
        </div>
      </div>

      <div
        class="d-flex flex-md-row gap-md-5 flex-column justify-content-between"
      >
        <div class="w-100 w-md-50">
          <label class="form-label movies-label mt-4">Sinopsis</label>
          <div
            class="d-flex flex-column flex-md-row align-items-md-start gap-3"
          >
            <div class="flex-grow-1">
              <input
                type="text"
                class="form-control   w-100"
                :class="{ 'is-invalid': v$.synopsis.$error }"
                v-model="synopsis"
              />
              <div
                class="invalid-feedback"
                v-if="v$.synopsis.required.$invalid"
              >
                Este campo es obligatorio
              </div>
              <div
                class="invalid-feedback"
                v-if="v$.synopsis.minLength.$invalid"
              >
                La sinopsis debe tener al menos
                {{ v$.synopsis.minLength.$params.min }} caracteres
              </div>
            </div>
          </div>
        </div>

        <div class="w-100 w-md-50">
          <label class="form-label movies-label mt-4"
            >Imagen de fondo (URL)</label
          >
          <div
            class="d-flex flex-column flex-md-row align-items-md-start gap-3"
          >
            <div class="flex-grow-1">
              <input
                type="text"
                class="form-control   w-100"
                v-model="backdrop"
                :class="{ 'is-invalid': v$.backdrop.$error }"
              />
              <div
                class="invalid-feedback"
                v-if="backdrop && v$.backdrop.url.$invalid"
              >
                Ingrese una URL válida
              </div>
            </div>
          </div>
        </div>
      </div>


        <div class="w-100">
          <label class="form-label movies-label mt-4">Frase promocional</label>
          <div
            class="d-flex flex-column flex-md-row align-items-md-start gap-3"
          >
            <div class="flex-grow-1">
              <input
                type="text"
                class="form-control   w-100"
                v-model="tagline"
                :class="{ 'is-invalid': v$.tagline.$error }"
              />
              <div
                class="invalid-feedback"
                v-if="tagline && v$.tagline.minLength.$invalid"
              >
                El eslogan debe tener al menos
                {{ v$.tagline.minLength.$params.min }} caracteres.
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex flex-column flex-md-row justify-content-between gap-md-3 mb-4">
                   <div class="w-100 w-md-50">
          <label class="form-label movies-label mt-4"
            >Puntuación de TMDB (0–10)</label
          >
          <div
            class="d-flex flex-column flex-md-row align-items-md-start gap-3"
          >
            <div class="flex-grow-1">
              <input
                type="text"
                class="form-control  w-100"
                disabled
                v-model="vote_average"
                :class="{ 'is-invalid': v$.vote_average.$error }"
              />
            </div>
          </div>
        </div>

        <div class="w-100 w-md-50">
          <label class="form-label movies-label mt-4"
            >Cantidad de votos en TMDB</label
          >
          <div
            class="d-flex flex-column flex-md-row align-items-md-start gap-3"
          >
            <div class="flex-grow-1">
              <input
                type="number"
                class="form-control   w-100"
                v-model="vote_count"
                disabled
              />
            </div>
          </div>
        </div>
        </div>

 

        <div class="w-100 mb-4">
          <label class="form-label movies-label">Duracion en minutos</label>
          <div
            class="d-flex flex-column flex-md-row align-items-md-start gap-3"
          >
            <div class="flex-grow-1">
              <input
                type="number"
                class="form-control  w-100"
                v-model="runtime"
                :class="{ 'is-invalid': v$.runtime.$error }"
              />
              <div class="invalid-feedback" v-if="v$.runtime.$error">
                Este campo es obligatorio
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex flex-column flex-md-row justify-content-between gap-md-3 mb-4">
                    <div class="w-100 w-md-50">
          <label class="form-label movies-label">Presupuesto (USD)</label>
          <div
            class="d-flex flex-column flex-md-row align-items-md-start gap-3"
          >
            <div class="flex-grow-1">
              <input
                type="number"
                class="form-control   w-100"
                v-model="budget"
                :class="{ 'is-invalid': v$.budget.$error }"
              />
            </div>
          </div>
        </div>

        <div class="w-100 w-md-50">
          <label class="form-label movies-label">Recaudacion (USD)</label>
          <div
            class="d-flex flex-column flex-md-row align-items-md-start gap-3"
          >
            <div class="flex-grow-1">
              <input
                type="number"
                class="form-control   w-100"
                v-model="revenue"
                :class="{ 'is-invalid': v$.revenue.$error }"
              />
            </div>
          </div>
        </div>
        </div>

        <div class="w-100 mb-5">

          <label class="form-label movies-label my-4">Actores</label>
          <p v-if="selectedActors.length === 0" class="form-label small movies-label mb-3">Sin actores seleccionados</p>
          <div v-else class="d-flex flex-wrap gap-2 mb-5">
            <span v-for="actorId in selectedActors" :key="actorId" class="border border-secondary-subtle rounded-3 px-3 py-2 text-white bg-dark bg-opacity-25 small">
              {{ actors.find(a => a.id === actorId)?.name }}
            </span>
          </div>
          <button
            type="button"
            class="btn btn-select px-4"
            data-bs-toggle="modal"
            data-bs-target="#selectModal"
            @click="inputSelection = 'actor'"
          >
          <font-awesome-icon icon="fa-solid fa-plus responsive-icon" />
            Seleccionar actor
          </button>

          <div class="text-danger small mt-1" v-if="v$.actors.$error">
            Seleccione al menos un actor
          </div>
        </div>

        <div class="w-100 mb-5">

          <label class="form-label movies-label mb-4">Generos</label>
          <p v-if="selectedGenres.length === 0" class="form-label small movies-label mb-3">Sin Generos seleccionados</p>
          <div v-else class="d-flex flex-wrap gap-2 mb-5">
            <span v-for="genreId in selectedGenres" :key="genreId" class="border border-secondary-subtle rounded-3 px-3 py-2 text-white bg-dark bg-opacity-25 small">
              {{ genres.find(g => g.id === genreId)?.name }}
            </span>
          </div>
          <button
            type="button"
            class="btn btn-select px-4"
            data-bs-toggle="modal"
            data-bs-target="#selectModal"
            @click="inputSelection = 'genre'"
          >
          <font-awesome-icon icon="fa-solid fa-plus responsive-icon" />
            Seleccionar genero
          </button>

          <div class="text-danger small mt-1" v-if="v$.genres.$error">
            Seleccione al menos un genero
          </div>
        </div>


      <div class="d-flex justify-content-end mt-3">
          <button type="button" class="btn btn-danger align-items-center mt-4 px-4 py-2 me-4" @click="resetForm">
          <font-awesome-icon icon="fa-solid fa-broom responsive-icon" />
          Limpiar
        </button>
        <button class="btn btn-yellow align-items-center mt-4 px-4 py-2" :disabled="v$.$invalid && v$.$dirty">
          <font-awesome-icon icon="fa-solid fa-floppy-disk responsive-icon" />
          Guardar
        </button>
        <button
          type="button"
          v-if="moviesStore.selectedMovie"
          @click="cancelEdit"
          class="btn btn-danger"
        >
          Cancelar edición
        </button>
      </div>
    </div>
  </form>

 
</template>

<script setup>
// VUE Libraries
import { ref, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import {
  between,
  minLength,
  numeric,
  required,
  url,
  integer,
} from "@vuelidate/validators";
import { getMovieRules } from "@/utils/validations/movieRules.js";
import { useToast } from "vue-toastification";
// Services
import { searchTMDBMovies, getTMDBDetails } from "@/services/tmdbService";
// Stores
import { useMoviesStore } from "@/stores/moviesStore";
// Components
import TMDBInput from "./TMDBInput.vue";
import SearchSelectModal from "./SearchSelectModal.vue";

// Props

const props = defineProps({
  movie: Object,
  actors: Array,
  genres: Array,
  movies: Array,
});

// Emits (from MoviesView)

const emit = defineEmits(["save"]);

// Composables

const moviesStore = useMoviesStore();
const toast = useToast();

// Constants

const actualYear = new Date().getFullYear();

// Refs

// Movie data
const name = ref("");
const year = ref(null);
const poster = ref("");
const synopsis = ref("");
const selectedActors = ref([]);
const selectedGenres = ref([]);
const backdrop = ref("");
const vote_average = ref(0);
const vote_count = ref(0);
const runtime = ref(0);
const tagline = ref("");
const budget = ref(0);
const revenue = ref(0);
const tmdbId = ref(null);

const inputSelection = ref("");
const tmdbSearchTerm = ref("");
const tmdbResults = ref([]);

const type = ref("")


// Vuelidate
const rules = getMovieRules()

const v$ = useVuelidate(rules, {
  name,
  year,
  poster,
  synopsis,
  backdrop,
  vote_average,
  vote_count,
  tagline,
  budget,
  revenue,
  runtime,
  actors: selectedActors,
  genres: selectedGenres,
}, {$scope: 'create-movie' });

// Watchers

watch(
  () => moviesStore.selectedMovie,
  (newMovie) => {
    if (newMovie) {
      name.value = newMovie.name;
      poster.value = newMovie.poster;
      year.value = newMovie.year;
      synopsis.value = newMovie.synopsis;
      selectedActors.value = newMovie.actors || [];
      selectedGenres.value = newMovie.genres || [];
      backdrop.value = newMovie.backdrop || "";
      vote_average.value = newMovie.vote_average || 0;
      vote_count.value = newMovie.vote_count || 0;
      runtime.value = newMovie.runtime || 0;
      tagline.value = newMovie.tagline || "";
      budget.value = newMovie.budget || 0;
      revenue.value = newMovie.revenue || 0;
    } else {
      resetForm();
    }
  },
);

// Methods

// Clear all form values

const resetForm = () => {
  tmdbId.value = 0;
  name.value = "";
  poster.value = "";
  year.value = "";
  synopsis.value = "";
  selectedActors.value = [];
  selectedGenres.value = [];
  backdrop.value = "";
  vote_average.value = 0;
  vote_count.value = 0;
  runtime.value = 0;
  tagline.value = "";
  budget.value = 0;
  revenue.value = 0;
  v$.value.$reset();
};

/**
 * Function to cancel the editing of a movie
 * Clears the form values and assigns null to the movie being edited in the store
 */

const cancelEdit = () => {
  resetForm();
  moviesStore.setMovie(null);
};

/**
 * Function to submit the form values to the database
 * First, it checks if all fields meet the requirements defined by Vuelidate
 * If so, it creates an object with all the form values
 * After that, it verifies whether the entered movie already exists based on its name and year; if it exists, it throws an error
 * If not, it uploads the values to the database
 */

const submitForm = async () => {
  const result = await v$.value.$validate();


  if (!result) return;

  const movieSubmit = {
    name: name.value,
    tmdbId: tmdbId.value,
    poster: poster.value,
    year: year.value,
    synopsis: synopsis.value,
    actors: selectedActors.value,
    genres: selectedGenres.value,
    backdrop: backdrop.value,
    vote_average: vote_average.value,
    vote_count: vote_count.value,
    runtime: runtime.value,
    tagline: tagline.value,
    budget: budget.value,
    revenue: revenue.value,
  };

  const existingMovie = props.movies?.find(
    (p) =>
      p.name.toLowerCase() === movieSubmit.name.toLowerCase() &&
      p.year === movieSubmit.year,
  );

  const editingId = moviesStore.selectedMovie?.id;

  if (existingMovie && existingMovie.id !== editingId) {
    toast.error(
      "La película que estás ingresando ya existe en la base de datos",
    );
    return;
  }
  emit("save", movieSubmit);
  resetForm();

  v$.value.$reset();
};

const selectValues = (data) => {
  if (inputSelection.value === 'actor') selectedActors.value = data
  else selectedGenres.value = data
}

const insertMovie = async (id) => {
  const movie = await getTMDBDetails(id);
  tmdbId.value = movie.tmdbId;
  name.value = "";
  poster.value = "";
  year.value = "";
  synopsis.value = "";
  selectedActors.value = [];
  selectedGenres.value = [];
  backdrop.value = "";
  vote_average.value = 0;
  vote_count.value = 0;
  runtime.value = 0;
  tagline.value = "";
  budget.value = 0;
  revenue.value = 0;

  name.value = movie.title;
  synopsis.value = movie.overview;
  year.value = movie.release_date
    ? parseInt(movie.release_date.slice(0, 4))
    : null;
  poster.value = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";
  backdrop.value = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : "";
  vote_average.value = movie.vote_average;
  vote_count.value = movie.vote_count;
  runtime.value = movie.runtime;
  tagline.value = movie.tagline;
  budget.value = movie.budget;
  revenue.value = movie.revenue;
  tmdbId.value = id;

  const idsGenerosMatched = [];
  movie.genres.forEach((gTMDB) => {
    const geneMatch = props.genres.find(
      (gLoc) => gLoc.name.toLowerCase() === gTMDB.name.toLowerCase(),
    );
    if (geneMatch) idsGenerosMatched.push(geneMatch.id);
  });
  selectedGenres.value = idsGenerosMatched;
};

/**

* Function to auto-fill the entry form with TMDB data
* If no data is found, it returns null
* If data is found, it assigns the retrieved values to the form
* It also uses the forEach method to find all movie genres that exist in the database and assigns them to the form
  */

const selectTMDBMovie = async (id) => {
  const p = await getTMDBDetails(id);

  if (!p || !p.genres) {
    toast.error("No se pudieron cargar los detalles de esta película.");
    return;
  }
  name.value = p.title;
  synopsis.value = p.overview;
  year.value = p.release_date ? parseInt(p.release_date.slice(0, 4)) : null;
  poster.value = p.poster_path
    ? `https://image.tmdb.org/t/p/w500${p.poster_path}`
    : "";
  backdrop.value = p.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${p.backdrop_path}`
    : "";
  vote_average.value = p.vote_average;
  vote_count.value = p.vote_count;
  runtime.value = p.runtime;
  tagline.value = p.tagline;
  budget.value = p.budget;
  revenue.value = p.revenue;
  tmdbId.value = id;

  const idsGenerosMatched = [];
  p.genres.forEach((gTMDB) => {
    const geneMatch = props.genres.find(
      (gLoc) => gLoc.name.toLowerCase() === gTMDB.name.toLowerCase(),
    );
    if (geneMatch) idsGenerosMatched.push(geneMatch.id);
  });
  selectedGenres.value = idsGenerosMatched;
  tmdbResults.value = [];
  tmdbSearchTerm.value = "";
};
</script>

<style scoped lang="scss">
@use "sass:color";
@use "@/assets/scss/abstracts/variables" as *;
@use "@/assets/scss/abstracts/mixins" as *;

.movies-form {
  background-color: color.adjust($color: $secondary-color, $lightness: 4%);
  border-radius: 20px;
}



.movies-label {
  color: color.adjust($color: $secondary-color, $lightness: 50%);
}

.tmdb-label {
  color: $primary-color;
}

.department-tmdb {
  color: color.adjust($color: $secondary-color, $lightness: 50%);
}

.popularity-tmdb {
  color: $primary-color;
}

.btn-select {
  background-color: $primary-color;
}
</style>
