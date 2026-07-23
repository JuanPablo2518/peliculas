<!-- FormView -->
<template>
      <div class="modal" id="editModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <SearchSelectModal v-if="inputSelection === 'actor'" :data="actors" :movies="movies" :type="inputSelection" @save="selectValues" :initial-selected-ids="editingMovieForm?.actors || []"  />
      <SearchSelectModal v-else-if="inputSelection === 'genre'" :data="genres" :movies="movies" :type="inputSelection" @save="selectValues" :initial-selected-ids="editingMovieForm?.genres || []" />
    </div>
  </div>

  <MoviesForm
    @save="saveMovie"
    :actors="actors"
    :genres="genres"
    :movies="movies"
  />

    <div class="d-flex align-items-center justify-content-between mb-3">
    <div class="d-flex gap-3">
      <h5 class="m-0">Listado</h5>
      <p class="small border border-2 rounded px-3">
        {{ movies.length }} Peliculas
      </p>
    </div>
    <button
      class="btn btn-outline-light"
      @click="activeFilter = activeFilter === 'asc' ? 'desc' : 'asc'"
    >
      <font-awesome-icon icon="fa-solid fa-up-down" />
      {{ activeFilter === "asc" ? "A <- Z" : "Z -> A" }}
    </button>
  </div>

   <table class="table table-striped mb-5">
    <thead>
      <tr>
        <th>Nombre</th>
        <!-- <th>Acciones</th> -->
      </tr>
    </thead>
    <tbody>
      <!-- Table Content -->
      <tr v-for="movie in sortedMovies" :key="movie.id">
        <td>
          <a
            data-bs-toggle="collapse"
            :data-bs-target="'#movieContent' + movie.id"
            class="d-flex align-items-center justify-content-between px-3 py-2"
          >
            {{ movie.name }} <font-awesome-icon icon="fa-solid fa-angle-down" />
          </a>

          <div :id="'movieContent' + movie.id" class="collapse table-content "">
            <div class="d-flex flex-column flex-md-row align-items-stretch">
              <div
                class="d-flex align-items-center photo-side p-4 gap-4 flex-column flex-shrink-0 me-1 me-md-3 me-lg-5"
              >
                <img
                  :src="
                    movie.poster || moviePlaceholder
                  "
                  class="img-fluid"
                  alt=""
                />
                <h3> <strong>Duracion: </strong> {{  convertMinutes(movie.runtime)[0]}}:{{  convertMinutes(movie.runtime)[1]}} Horas  </h3>
                <h4>{{ movie.favsCount || 0}} <strong>Likes</strong></h4>
                <div
                  class="d-flex flex-column justify-content-between w-100  px-3 gap-3"
                >
                  <button
                    class="btn btn-outline-light btn-sm py-2"
                    @click="alternateEditingMovie(movie)"
                  >
                    <font-awesome-icon
                      v-if="editingMovie !== movie.id"
                      class="me-1"
                      icon="fa-solid fa-pencil"
                    />
                    <font-awesome-icon
                      v-else
                      class="me-1"
                      icon="fa-solid fa-xmark"
                    />
                    {{ editingMovie === movie.id ? "Cancelar" : "Editar" }}
                  </button>
                  <button
                    v-if="editingMovie === movie.id"
                    class="btn btn-outline-light btn-sm py-2"
                    @click="editMovie"
                  >
                    <font-awesome-icon
                      class="me-1"
                      icon="fa-solid fa-floppy-disk"
                    />
                    Guardar
                  </button>
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#movieModal"
                    @click="removeMovie(movie.id)"
                    class="btn btn-outline-light btn-sm py-2"
                  >
                    <font-awesome-icon class="me-1" icon="fa-solid fa-trash" />
                    Eliminar
                  </button>
                </div>
              </div>

              <div class="table-content flex-grow-1 p-5 overflow-y-auto" style="max-height: 700px;">
                <!-- INFORMACIÓN BÁSICA -->
                <div class="mb-4">
                  <p class="border-bottom pb-1">
                    <font-awesome-icon
                      class="me-1"
                      icon="fa-solid fa-circle-info"
                    />
                    INFORMACION BASICA
                  </p>

                  <div class="d-flex flex-column mb-3">
                    <p class="mb-2">
                      <font-awesome-icon
                        class="me-1 movie-icon"
                        icon="fa-solid fa-film"
                      />
                      Nombre
                    </p>
                    <p v-if="editingMovie !== movie.id" class="mb-0">
                      {{ movie.name }}
                    </p>

                    <input
                      v-else
                      class="form-control"
                      :class="{ 'is-invalid': v$.name.$error }"
                      type="text"
                      v-model="editingMovieForm.name"
                      :placeholder="movie.name"
                    />

                              <div v-if="v$.name.$dirty"></div>
          <div class="invalid-feedback" v-if="v$.name.required.$invalid">
            Por favor, ingrese un nombre
          </div>
          <div class="invalid-feedback" v-if="v$.name.minLength.$invalid">
            El nombre debe ser de al menos
            {{ v$.name.minLength.$params.min }} caracteres.
          </div>
                  </div>

                                    <div class="d-flex flex-column mb-3">
                    <p class="mb-2">
                      <font-awesome-icon
                        class="me-1 movie-icon"
                        icon="fa-solid fa-calendar"
                      />
                      Año
                    </p>
                    <p v-if="editingMovie !== movie.id" class="mb-0">
                      {{ movie.year }}
                    </p>

                    <input
                      v-else
                      class="form-control"
                      type="number"
                      step="1"
                       @keydown="
              ['.', ','].includes($event.key) && $event.preventDefault()"
              :class="{ 'is-invalid': v$.year.$error }"
                      v-model="editingMovieForm.year"
                      :placeholder="movie.year"
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

                  <div class="d-flex flex-column mb-3">
                    <p class="mb-2">
                      <font-awesome-icon
                        class="me-1 movie-icon"
                        icon="fa-solid fa-file-lines"
                      />
                      Sinopsis
                    </p>
                    <p class="mb-0" v-if="editingMovie !== movie.id">
                      {{ movie.synopsis  }}
                    </p>
                    <textarea
                      class="form-control"
                      v-else
                      type="text"
                      v-model="editingMovieForm.synopsis"
                      :class="{ 'is-invalid': v$.synopsis.$error }"
                      :placeholder="movie.synopsis"
                    ></textarea>

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

                  <div class="d-flex flex-column mb-3">
                    <p class="mb-2">
                      <font-awesome-icon
                        class="me-1 movie-icon"
                        icon="fa-solid fa-quote-left"
                      />
                      Frase promocional
                    </p>
                    <p v-if="editingMovie !== movie.id" class="mb-0">
                      {{ movie.tagline }}
                    </p>

                    <input
                      v-else
                      class="form-control"
                      :class="{ 'is-invalid': v$.tagline.$error }"
                      type="text"
                      v-model="editingMovieForm.tagline"
                      :placeholder="movie.tagline"
                    />
              <div
                class="invalid-feedback"
                v-if="editingMovieForm?.tagline && v$.tagline.minLength.$invalid"
              >
                El eslogan debe tener al menos
                {{ v$.tagline.minLength.$params.min }} caracteres.
              </div>
                  </div>

                                    <div class="d-flex flex-column mb-3">
                    <p class="mb-2">
                      <font-awesome-icon
                        class="me-1 movie-icon"
                        icon="fa-solid fa-clock"
                      />
                      Duracion (Minutos)
                    </p>
                    <p v-if="editingMovie !== movie.id" class="mb-0">
                      {{ movie.runtime }}
                    </p>

                    <input
                      v-else
                      class="form-control"
                      type="number"
                      v-model="editingMovieForm.runtime"
                      :class="{ 'is-invalid': v$.runtime.$error }"
                      :placeholder="movie.runtime"
                    />
                    <div class="invalid-feedback" v-if="v$.runtime.$error">
                Este campo es obligatorio
                    </div>
                  </div>
                </div>

                <!-- FECHAS -->
                <div class="mb-4">
                  <p class="border-bottom pb-1 color-white">
                    <font-awesome-icon
                      class="me-1"
                      icon="fa-solid fa-money-bill-wave"
                    />
                    Economico
                  </p>
                  <div class="d-flex row w-100">
                                      <div class="d-flex flex-column mb-3">
                    <p class="mb-2">
                      <font-awesome-icon
                        class="me-1 movie-icon"
                        icon="fa-solid fa-chart-line"
                      />
                      Ganancias
                    </p>
                    <p v-if="editingMovie !== movie.id" class="mb-0">
                      {{ movie.revenue }}
                    </p>

                    <input
                      v-else
                      class="form-control"
                      type="number"
                      v-model="editingMovieForm.revenue"
                      :class="{ 'is-invalid': v$.revenue.$error }"
                      :placeholder="movie.revenue"
                    />
                  </div>

                    <div class="d-flex flex-column mb-3">
                    <p class="mb-2">
                      <font-awesome-icon
                        class="me-1 movie-icon"
                        icon="fa-solid fa-sack-dollar"
                      />
                      Presupuesto
                    </p>
                    <p v-if="editingMovie !== movie.id" class="mb-0">
                      {{ movie.budget }}
                    </p>

                    <input
                      v-else
                      class="form-control"
                      type="number"
                      v-model="editingMovieForm.budget"
                       :class="{ 'is-invalid': v$.budget.$error }"
                      :placeholder="movie.budget"
                    />
                  </div>
                  </div>
                </div>

                <div class="mb-4">
                            <p class="border-bottom pb-1 color-white">
                    <font-awesome-icon
                      class="me-1"
                      icon="fa-solid fa-layer-group"
                    />
                    Reparto y generos
                  </p>



                  <p class="my-3">
                      <font-awesome-icon
                        class="me-1 movie-icon"
                        icon="fa-solid fa-users"
                      />
                      Actores
                    </p>
                  <div class="d-flex overflow-x-auto gap-4 text-center"  v-if="editingMovie !== movie.id">
                    
                    <div class=" icon-card p-3 " v-for="actor in getMovieActors(movie.actors)" :key="actor.id">
                      <img class="icons-photo img-fluid mb-3" :src="actor.photo || actorPlaceholder" alt="">
                      <span class="d-block" >{{ actor.name }}</span>
                    </div>
                    <span v-if="!movie.actors || movie.actors.length === 0">Sin actores asignados</span>
                  </div>
                  
                  <div v-else>
                                      <div class="d-flex overflow-x-auto gap-4 text-center " > 
                    <div class="icon-card p-3" v-for="actor in getMovieActors(editingMovieForm?.actors)" :key="actor.id">
                      <img class="icons-photo img-fluid mb-3"  :src="actor.photo || actorPlaceholder" alt="">
                      <span>{{ actor.name }}</span>
                    </div>
                    
                  </div>
                  <button type="button" class="mt-4 modal-button py-3 px-5 border border-0 rounded-3" data-bs-target="#editModal" data-bs-toggle="modal" @click="inputSelection = 'actor'"><p class="mb-0">Seleccionar Actores</p></button>
                  <div class="text-danger small mt-1" v-if="v$.actors.$error">
                    Seleccione al menos un actor
                  </div>
                  </div>

                </div>
               
                

<p class="my-3">
                      <font-awesome-icon
                        class="me-1 movie-icon"
                        icon="fa-solid fa-tag"
                      />
                      Generos
                    </p>
                <div class="d-flex overflow-x-auto gap-4 text-center"  v-if="editingMovie !== movie.id">
                    <div class=" icon-card p-3 " v-for="genre in getMovieGenres(movie.genres)" :key="genre.id">
                      <img class="icons-photo img-fluid mb-3" :src="genrePlaceholder" alt="">
                      <span class="d-block" >{{ genre.name }}</span>
                    </div>
                    <span v-if="!movie.genres || movie.genres.length === 0">Sin actores asignados</span>
                  </div>

                  <div v-else>
                                      <div class="d-flex overflow-x-auto gap-4 text-center " > 
                    <div class="icon-card p-3" v-for="genre in getMovieGenres(editingMovieForm?.genres)" :key="genre.id">
                      <img class="icons-photo img-fluid mb-3" :src="'https://placehold.co/600x401'" alt="">
                      <span>{{ genre.name }}</span>
                    </div>
                    
                  </div>
                  <button type="button" class="mt-4 modal-button py-3 px-5 border border-0 rounded-3" data-bs-target="#editModal" data-bs-toggle="modal" @click="inputSelection = 'genre'"><p class="mb-0">Seleccionar Generos</p></button>
                  <div class="text-danger small mt-1" v-if="v$.genres.$error">
                    Seleccione al menos un genero
                  </div>
                  </div> 
                                  <div class="mt-5">
                  <div>
                  <p
                  v-if="editingMovie === movie.id"
                  class="border-bottom pb-1 color-white"
                >
                  <font-awesome-icon class="me-1" icon="fa-solid fa-images" />
                  Imagenes
                </p>

                <div
                  v-if="editingMovie === movie.id"
                  class="d-flex flex-column mb-3"
                >
                  <p class="mb-2">
                    <font-awesome-icon
                      class="movie-icon"
                      icon="fa-solid fa-image"
                    />
                    Poster
                  </p>

                  <input
                    class="form-control"
                    type="text"
                    :class="{ 'is-invalid': v$.poster.$error }"
                    v-model="editingMovieForm.poster"
                    :placeholder="movie.poster"
                  />
                  <div
                class="invalid-feedback"
                v-if="editingMovieForm?.poster && v$.poster.url.$invalid"
              >
                Ingrese una URL válida
              </div>
                </div>
                </div>
                <div>

                <div
                  v-if="editingMovie === movie.id"
                  class="d-flex flex-column mb-3"
                >
                  <p class="mb-2">
                    <font-awesome-icon
                      class="movie-icon"
                      icon="fa-solid fa-panorama"
                    />
                    Backdrop
                  </p>

                  <input
                    class="form-control"
                    type="text"
                    v-model="editingMovieForm.backdrop"
                    :class="{ 'is-invalid': v$.backdrop.$error }"
                    :placeholder="movie.backdrop"
                  />
                                <div
                class="invalid-feedback"
                v-if="editingMovieForm?.backdrop && v$.backdrop.url.$invalid"
              >
                Ingrese una URL válida
              </div>
                </div>
                </div>
                </div>
                </div>
              </div>
            </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
// VUE Libraries
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useToast } from "vue-toastification";
import useVuelidate from "@vuelidate/core";
import {
  createMovie,
  updateMovie,
  subscribeMovies,
  deleteMovie
} from "@/services/movieService";
import { convertMinutes } from "@/utils/moviesUtils";
import MoviesForm from "@/components/MoviesForm.vue";
import { subscribeGenres } from "@/services/genreService";
import { subscribeActors } from "@/services/actorService";
import SearchSelectModal from "@/components/SearchSelectModal.vue";
import genrePlaceholder from "@/assets/img/genrePlaceholder.png"
import moviePlaceholder  from "@/assets/img/moviePlaceholder.png"
import actorPlaceholder  from "@/assets/img/actorPlaceholder.png"
import { getMovieRules } from "@/utils/validations/movieRules";

// Components

// Composables
const toast = useToast();

// Let
let unsubscribe;
let unsubscribeGenres;
let unsubscribeActors;

// Refs
const editingMovieForm = ref({
  name: '',
  year: null,
  synopsis: '',
  tagline: '',
  runtime: null,
  revenue: null,
  budget: null,
  poster: '',
  backdrop: '',
  actors: [],
  genres: []
})
const actors = ref([]);
const genres = ref([])
const movies = ref([]);
const selectedMovie = ref(null);
const editingMovie = ref("");
const inputSelection = ref("")
const activeFilter = ref("");

const rules = getMovieRules()

const v$ = useVuelidate(rules, editingMovieForm, {$scope: 'edit-movie'})

// Lifecycle Hooks

// Method to start the subscription that updates data in real time when the component is mounted
onMounted(() => {
  unsubscribe = subscribeMovies((data) => {
    movies.value = data;
  });
  unsubscribeActors = subscribeActors((data) => {
    actors.value = data;
  });
  unsubscribeGenres = subscribeGenres((data) => {
    genres.value = data;
  });
});

// Method to unsubscribe when the component is unmounted
onUnmounted(() => {
  if (unsubscribe) unsubscribe();
  if (unsubscribeActors) unsubscribeActors();
  if (unsubscribeGenres) unsubscribeGenres();
});

// Methods

/**
 * Method to save the actor in the database
 * If the form is in edit mode, it will use the update method to update the data in the database based on the selected actor's ID
 * If the form is NOT in edit mode, it will use the create method to insert data into the database
 */

const saveMovie = async (movie) => {
  createMovie(movie);
  toast.success("Se ha ingresado correctamente la pelicula.");
};

// Method that activates edit mode
const alternateEditingMovie = (movie) => {
  if (editingMovie.value === movie.id) {
    editingMovie.value = "";
    editingMovieForm.value = null
    selectedMovie.value = null
  }
  else {
    editingMovie.value = movie.id;
    selectedMovie.value = movie
    console.log(editingMovieForm.value)
    editingMovieForm.value = JSON.parse(JSON.stringify(movie))

    if (!editingMovieForm.value.actors) {
      editingMovieForm.value.actors = []
    }
  }
};

const selectValues = (selectedIds) => {
  if (editingMovieForm.value) {
    if (inputSelection.value === 'actor') {
      editingMovieForm.value.actors = selectedIds
    } else if (inputSelection.value === 'genre') {
      editingMovieForm.value.genres = selectedIds
    }
  }
}

const editMovie = async () => {
   
  const result = await v$.value.$validate()

  if (!result) {
    toast.error("Por favor, corrige los errores del formulario")
    return
  }

  if(editingMovieForm.value) {
    await updateMovie(editingMovieForm.value.id, editingMovieForm.value)
    toast.success("Se ha editado correctamente la pelicula.")
    editingMovie.value = ""
    v$.value.$reset()
  }
};


/**
 * Method to delete actors from the database
 * First, it shows a message to confirm whether the user wants to delete the data
 * If so, it deletes the data from the database and notifies the user
 */

const removeMovie = async (id) => {
  const confirmed = confirm("¿Estas seguro de que quieres eliminar esta pelicula?")
  if (!confirmed) return

  await deleteMovie(id);
  toast.success("Se ha eliminado correctamente la pelicula.");
};

const getMovieActors = (actorIds) => {
  if (!actorIds || !Array.isArray(actorIds)) return []
  return actors.value.filter(actor => actorIds.includes(actor.id))
}

const getMovieGenres = (genreIds) => {
  if (!genreIds || !Array.isArray(genreIds)) return []
  return genres.value.filter(genre => genreIds.includes(genre.id))
}

const sortedMovies = computed(() => {
  const copy = [...movies.value];

  if (!activeFilter.value) return copy;

  copy.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if (activeFilter.value === "asc") {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });
  return copy;
});
</script>

<style scoped lang="scss">
@use "sass:color";

@use "@/assets/scss/abstracts/variables" as *;
@use "@/assets/scss/abstracts/mixins" as *;

.actors-title {
  font-weight: 800;
  font-size: clamp(1.8rem, 3vw, 3.6rem);
}

img {
  width: clamp(300px, 13vw, 450px);
  object-fit: contain;
}

.photo-side {
  background-color: color.adjust($secondary-color, $lightness: -1%);
}

.movie-icon {
  color: $primary-color;
  margin-right: 4px;
}

.icons-photo {
  aspect-ratio: 1/1;
  object-fit: cover;
  width: clamp(40px, 6vw, 80px);
  border-radius: 10%;
}

.icon-card {
  background-color: color.adjust($secondary-color, $lightness: -1%);
  border-radius: 10%;
  max-width: 125px;
  flex-shrink: 0;
}

.modal-button {
    background-color: color.adjust($secondary-color, $lightness: -1%);

    &:hover {
      background-color: color.adjust($secondary-color, $lightness: -5%);
    }
}
</style>
