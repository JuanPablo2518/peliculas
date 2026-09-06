<!-- Actors View -->

<template>
  <!-- Title -->
  <h1 class="actors-title text-center my-5">Ingresar Actores</h1>

  <ActorForm @save="saveActor" @cancel="resetForm" />

  <div class="d-flex align-items-center justify-content-between mb-3">
    <div class="d-flex gap-3">
      <h5 class="m-0">Listado</h5>
      <p class="small border border-2 rounded px-3">
        {{ actors.length }} géneros
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

  <!-- Table of actors -->
  <table class="table table-striped mb-5">
    <thead>
      <tr>
        <th>Nombre</th>
        <!-- <th>Acciones</th> -->
      </tr>
    </thead>
    <tbody>
      <!-- Table Content -->
      <tr v-for="actor in sortedActors" :key="actor.id">
        <td>
          <a
            data-bs-toggle="collapse"
            :data-bs-target="'#actorContent' + actor.id"
            class="d-flex align-items-center justify-content-between px-3 py-2"
          >
            {{ actor.name }} <font-awesome-icon icon="fa-solid fa-angle-down" />
          </a>

          <div :id="'actorContent' + actor.id" class="collapse table-content">
            <div class="d-flex flex-column flex-md-row align-items-stretch">
              <div
                class="d-flex align-items-center photo-side p-4 gap-3 flex-column flex-shrink-0 me-1 me-md-3 me-lg-5"
              >
                <img
                  :src="
                    actor.photo ||
                    'https://png.pngtree.com/png-vector/20221010/ourmid/pngtree-actors-icon-png-image_6293100.png'
                  "
                  class="img-fluid"
                  alt=""
                />
                <p
                  class=""
                  :class="
                    actor.gender === 'F' ? 'femenine-badge' : 'masculine-badge'
                  "
                >
                  {{ actor.gender === "M" ? "Masculino" : "Femenino" }}
                </p>
                <h4>{{ actor.tmdbPopularity || "-" }} <strong>TMDB</strong></h4>
                <div
                  class="d-flex flex-column justify-content-between w-100 pt-3 px-3 gap-3"
                >
                  <button
                    class="btn btn-outline-light btn-sm py-2"
                    @click="alternateEditingActor(actor)"
                  >
                    <font-awesome-icon
                      v-if="editingActor !== actor.id"
                      class="me-1"
                      icon="fa-solid fa-pencil"
                    />
                    <font-awesome-icon
                      v-else
                      class="me-1"
                      icon="fa-solid fa-xmark"
                    />
                    {{ editingActor === actor.id ? "Cancelar" : "Editar" }}
                  </button>
                  <button
                    v-if="editingActor"
                    class="btn btn-outline-light btn-sm py-2"
                    @click="editActor(editingActorForm)"
                  >
                    <font-awesome-icon
                      class="me-1"
                      icon="fa-solid fa-floppy-disk"
                    />
                    Guardar
                  </button>
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#actorModal"
                    @click="actorId = actor.id"
                    class="btn btn-outline-light btn-sm py-2"
                  >
                    <font-awesome-icon class="me-1" icon="fa-solid fa-trash" />
                    Eliminar
                  </button>
                </div>
              </div>

              <div class="table-content w-100 p-5">
                <!-- INFORMACIÓN BÁSICA -->
                <div class="mb-4">
                  <p class="border-bottom pb-1">
                    <font-awesome-icon
                      class="me-1"
                      icon="fa-solid fa-address-card"
                    />
                    INFORMACION BASICA
                  </p>

                  <div class="d-flex flex-column mb-3">
                    <p class="mb-2">
                      <font-awesome-icon
                        class="me-1 actor-icon"
                        icon="fa-solid fa-user"
                      />
                      Nombre
                    </p>
                    <p v-if="editingActor !== actor.id" class="mb-0">
                      {{ actor.name }}
                    </p>

                    <input
                      v-else
                      class="form-control"
                      type="text"
                      v-model="editingActorForm.name"
                      :placeholder="actor.name"
                      :class="{ 'is-invalid': v$.name.$error }"
                    />
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
                        class="me-1 actor-icon"
                        icon="fa-solid fa-book"
                      />
                      Biografia
                    </p>
                    <p class="mb-0" v-if="editingActor !== actor.id">
                      {{ actor.biography || "Sin Biografia" }}
                    </p>
                    <textarea
                      class="form-control"
                      v-else
                      :class="{ 'is-invalid': v$.biography.$error }"
                      type="text"
                      v-model="editingActorForm.biography"
                      :placeholder="actor.biography"
                    ></textarea>
                    <div class="invalid-feedback" v-if="v$.biography.minLength.$invalid">
            La biografia debe ser de al menos
            {{ v$.biography.minLength.$params.min }} caracteres.
          </div>
                  </div>
                </div>

                <!-- FECHAS -->
                <div class="mb-4">
                  <p class="border-bottom pb-1 color-white">
                    <font-awesome-icon
                      class="me-1"
                      icon="fa-solid fa-calendar"
                    />
                    FECHAS
                  </p>
                  <div class=" row w-100">
                    <div class="d-flex flex-column mb-3 col-12 col-md-6">
                      <p class="mb-2">
                        <font-awesome-icon
                          class="actor-icon"
                          icon="fa-solid fa-cake-candles"
                        />
                        Fecha de nacimiento
                      </p>
                      <p class="mb-0" v-if="editingActor !== actor.id">
                        {{ actor.dateOfBirth }}
                      </p>
                      <input
                        class="form-control"
                        v-else
                        type="date"
                        v-model="editingActorForm.dateOfBirth"
                        :placeholder="actor.dateOfBirth"
                        :class="{ 'is-invalid': v$.yearBirthDate.$error }"
                      />
                       <div
                class="invalid-feedback"
                v-if="v$.yearBirthDate.required.$invalid"
              >
                Por favor, ingrese una fecha
              </div>
              <div
                class="invalid-feedback"
                v-if="v$.yearBirthDate.between.$invalid"
              >
                El año ingresado es invalido
              </div>
                    </div>
                            <div class="d-flex flex-column mb-3 col-12 col-md-6">
                              <div :class="{ 'form-check form-switch': editingActor === actor.id }" >
                                                     <input
              class="form-check-input  "
              type="checkbox"
              id="checkNativeSwitch"
              switch
              v-if="editingActor === actor.id"
              v-model="enabledDD"
            />
                                  <p class="mb-2">
                        <font-awesome-icon
                          class="actor-icon"
                          icon="fa-solid fa-dove"
                        />
                        Fecha de fallecimiento
                      </p>
                              </div>
                      <p class="mb-0" v-if="editingActor !== actor.id">
                        {{ actor.dateOfDeath || "Sin registro" }}
                      </p>
                      <input
                        class="form-control "
                        v-else
                        type="date"
                        v-model="editingActorForm.dateOfDeath"
                        :class="{ 'is-invalid': v$.yearDeathDate.$error }"
                        :placeholder="actor.dateOfDeath"
                        :disabled="!enabledDD"
                      />
                                    <div
                class="invalid-feedback"
                v-if="v$.yearDeathDate.required.$invalid"
              >
                Por favor, ingrese una fecha
              </div>
              <div
                class="invalid-feedback"
                v-if="v$.yearDeathDate.between.$invalid"
              >
                El año ingresado es invalido
              </div>
                    </div>
                  </div>
                </div>

                <!-- OTROS DATOS -->
                <div class="mb-4">
                  <p class="border-bottom pb-1 color-white">
                    <font-awesome-icon
                      class="me-1"
                      icon="fa-solid fa-newspaper"
                    />
                    OTROS DATOS
                  </p>

                  <div
                    v-if="editingActor === actor.id"
                    class="d-flex flex-column mb-3"
                  >
                    <p class="mb-2">
                      <font-awesome-icon
                        v-if="actor.gender === 'M'"
                        class="actor-icon"
                        icon="fa-solid fa-mars"
                      />
                      <font-awesome-icon
                        v-else
                        class="actor-icon"
                        icon="fa-solid fa-venus"
                      />
                      Genero
                    </p>
                    <div></div>
                    <select class="form-select" v-model="editingActorForm.gender" :class="{ 'is-invalid': v$.gender.$error }">
                      <option value="">Seleccione</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                    <div
                class="invalid-feedback"
                v-if="v$.gender.oneOfGender.$invalid"
              >
                Por favor, Seleccione un genero
              </div>
                  </div>

                  <div class="d-flex flex-column mb-3">
                    <p class="mb-2">
                      <font-awesome-icon
                        class="actor-icon"
                        icon="fa-solid fa-map"
                      />
                      Ubicacion Nacimiento
                    </p>
                    <p class="mb-0" v-if="editingActor !== actor.id">
                      {{ actor.birthLocation }}
                    </p>
                    <input
                      class="form-control"
                      v-else
                      type="text"
                      v-model="editingActorForm.birthLocation"
                      :placeholder="actor.birthLocation"
                      :class="{ 'is-invalid': v$.birthLocation.$error }"
                    />
                    <div
                class="invalid-feedback"
                v-if="v$.birthLocation.minLength.$invalid"
              >
                El nombre debe ser de al menos
                {{ v$.birthLocation.minLength.$params.min }} caracteres.
              </div>
                  </div>
                </div>

                <!-- URL DE IMAGEN -->
                <p
                  v-if="editingActor === actor.id"
                  class="border-bottom pb-1 color-white"
                >
                  <font-awesome-icon class="me-1" icon="fa-solid fa-link" />
                  URL DE IMAGEN
                </p>

                <div
                  v-if="editingActor === actor.id"
                  class="d-flex flex-column mb-3"
                >
                  <p class="mb-2">
                    <font-awesome-icon
                      class="actor-icon"
                      icon="fa-solid fa-camera"
                    />
                    Imagen
                  </p>

                  <input
                    class="form-control"
                    type="text"
                    v-model="editingActorForm.photo"
                    :placeholder="editingActorForm.photo"
                    :class="{'is-invalid' : v$.photo.$error}"
                  />
                  <div class="invalid-feedback" v-if="photo && v$.photo.url.$invalid">
            La URL ingresada es incorrecta.
          </div>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="modal fade" id="actorModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Advertencia</h5>

          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          {{
            toDeleteMovies.length > 0
              ? ` Este actor aparece en ${toDeleteMovies.length} peliculas, al borrar
                    este
                    actor, este desaparecera de estas mismas, ¿desea continuar?`
              : "¿Desea borrar este actor?"
          }}

          <div class="my-3" v-for="movie in toDeleteMovies" :key="movie.id">
            + {{ movie.name }}
          </div>
        </div>

        <div class="modal-footer">
          <button
            @click="removeActor(actorId)"
            class="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Eliminar
          </button>
          <button class="btn btn-secondary" data-bs-dismiss="modal">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// VUE Libraries
import { ref, onMounted, onUnmounted, computed, watch, reactive } from "vue";
import { useToast } from "vue-toastification";
// Services
import {
  createActor,
  updateActor,
  deleteActor,
  subscribeActors,
} from "@/services/actorService";
import { subscribeMovies } from "@/services/movieService";
// Components
import ActorForm from "@/components/ActorForm.vue";
import { getMovieRules } from "@/utils/validations/movieRules";
import { getActorRules } from "@/utils/validations/actorRules";
import useVuelidate from "@vuelidate/core";

// Composables
const toast = useToast();

// Let
let unsubscribe;
let unsubscribeMovies;

// Refs
const editingActorForm = ref({
  name: '',
  photo: '',
  biography: '',
  dateOfBirth: '',
  dateOfDeath: '',
  gender: null,
  birthLocation: '',
})
const actors = ref([]);
const movies = ref([]);
const actorId = ref(null);
const selectedActor = ref(null);
const editingActor = ref("");
const enabledDD = ref(true)
const activeFilter = ref("");

// COMPUTED
const yearBirthDate = computed(() => Number(editingActorForm.value?.dateOfBirth?.split("-")[0]));
const yearDeathDate = computed(() => Number(editingActorForm.value?.dateOfDeath?.split("-")[0]));



const state = computed(() => {
  return {
  name: editingActorForm.value?.name,
  biography: editingActorForm.value?.biography,
  yearBirthDate: yearBirthDate.value,
  yearDeathDate: yearDeathDate.value,
  gender: editingActorForm.value?.gender,
  birthLocation: editingActorForm.value?.birthLocation,
  photo: editingActorForm.value?.photo,
}
});


const rules = getActorRules(enabledDD)

const v$ = useVuelidate(rules, state, {$scope: 'edit-actor'})

// Computed

watch(enabledDD, (value) => {
  if (!selectedActor.value) return
  if (!value) {
    selectedActor.value.dateOfDeath = "";
    editingActorForm.value.dateOfDeath = ""
  }
});


const toDeleteMovies = computed(() => {
  return movies.value.filter((movie) => movie.actors.includes(actorId.value));
});

// Lifecycle Hooks

// Method to start the subscription that updates data in real time when the component is mounted
onMounted(() => {
  unsubscribe = subscribeActors((data) => {
    actors.value = data;
  });
  unsubscribeMovies = subscribeMovies((data) => {
    movies.value = data;
  });
});

// Method to unsubscribe when the component is unmounted
onUnmounted(() => {
  if (unsubscribe) unsubscribe();
  if (unsubscribeMovies) unsubscribeMovies();
});

// Methods

/**
 * Method to save the actor in the database
 * If the form is in edit mode, it will use the update method to update the data in the database based on the selected actor's ID
 * If the form is NOT in edit mode, it will use the create method to insert data into the database
 */

const saveActor = async (actor) => {
  createActor(actor);
  toast.success("Se ha ingresado correctamente el actor.");
};

// Method that activates edit mode
const alternateEditingActor = (actor) => {
    if (editingActor.value === actor.id) {
    editingActor.value = "";
    editingActorForm.value = null
    selectedActor.value = null
  }
  else {
    editingActor.value = actor.id;
    selectedActor.value = actor
    editingActorForm.value = JSON.parse(JSON.stringify(actor))

    if(editingActorForm.value.dateOfDeath) {
      enabledDD.value = true
    }
    else enabledDD.value = false
  }
};

const editActor = async (actor) => {
  const result = await v$.value.$validate()

  if (!result) {
    toast.error("Por favor, corrige los errores del formulario")
    return
  }

  if (editingActorForm.value) {
    await updateActor(actor.id, actor);  
    toast.success("Se ha editado correctamente el actor.");
    editingActor.value = "";
    v$.value.$reset()
  }
  

};

/**
 * Method to delete actors from the database
 * First, it shows a message to confirm whether the user wants to delete the data
 * If so, it deletes the data from the database and notifies the user
 */

const removeActor = async (id) => {
    const confirmed = confirm("¿Estas seguro de que quieres eliminar esta pelicula?")
  if (!confirmed) return

  await deleteActor(id, toDeleteMovies.value);
  toast.success("Se ha eliminado correctamente el actor.");
};

const sortedActors = computed(() => {
  return [...actors.value].sort((a, b) => {
    if (activeFilter.value === 'asc') return a.name.localeCompare(b.name);
    if (activeFilter.value === 'desc') return b.name.localeCompare(a.name);
    return 0;
  });
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

.table {
  table-layout: fixed;
}

img {
  aspect-ratio: 1 / 1;
  width: clamp(150px, 13vw, 300px);
  object-fit: contain;
}

.actor-icon {
  color: $primary-color;
  margin-right: 4px;
}

.femenine-badge {
  @include gender-badge($femenine-color);
}

.masculine-badge {
  @include gender-badge($masculine-color);
}

.photo-side {
  background-color: color.adjust($secondary-color, $lightness: -1%);
}
</style>
