<!-- Actors View -->

<template>
  <!-- Title -->
  <h1 class="actors-title text-center my-5">Ingresar Actores</h1>

  <ActorForm @save="saveActor" @cancel="resetForm" />

  <button
    class="btn btn-success mb-3"
    @click="activeFilter = activeFilter === 'asc' ? 'desc' : 'asc'"
  >
    Ordenar: {{ activeFilter === "asc" ? "A - Z" : "Z - A" }}
  </button>

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
                    @click="editActor(actor)"
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
                    <font-awesome-icon class="me-1" icon="fa-solid fa-address-card" />
                    INFORMACION BASICA
                  </p>

                  <div class="d-flex flex-column mb-3">
                    <p class="mb-2">
                      <font-awesome-icon class="me-1 actor-icon" icon="fa-solid fa-user" />
                      Nombre
                    </p>
                    <p v-if="editingActor !== actor.id" class="mb-0">
                      {{ actor.name }}
                    </p>

                    <input
                      v-else
                      class="form-control"
                      type="text"
                      v-model="actor.name"
                      :placeholder="actor.name"
                    />
                  </div>

                  <div class="d-flex flex-column mb-3">
                    <p class="mb-2">
                      <font-awesome-icon class="me-1 actor-icon" icon="fa-solid fa-book" />
                      Biografia
                    </p>
                    <p class="mb-0" v-if="editingActor !== actor.id">
                      {{ actor.biography || "Sin Biografia" }}
                    </p>
                    <textarea
                      class="form-control"
                      v-else
                      type="text"
                      v-model="actor.biography"
                      :placeholder="actor.biography"
                    ></textarea>
                  </div>
                </div>

                <!-- FECHAS -->
                <div class="mb-4">
                  <p class="border-bottom pb-1 color-white">
                    <font-awesome-icon class="me-1" icon="fa-solid fa-calendar" />
                    FECHAS
                  </p>
                  <div class="d-flex row w-100">
                    <div class="d-flex flex-column mb-3 col-6">
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
                        v-model="actor.dateOfBirth"
                        :placeholder="actor.dateOfBirth"
                      />
                    </div>

                    <div class="d-flex flex-column mb-3 col-6">
                      <p class="mb-2">
                        <font-awesome-icon
                          class="actor-icon"
                          icon="fa-solid fa-dove"
                        />
                        Fecha de fallecimietno
                      </p>
                      <p class="mb-0" v-if="editingActor !== actor.id">
                        {{ actor.dateOfDeath || "Sin registro" }}
                      </p>
                      <input
                        class="form-control"
                        v-else
                        type="date"
                        v-model="actor.dateOfDeath"
                        :placeholder="actor.dateOfDeath"
                      />
                    </div>
                  </div>
                </div>

                <!-- OTROS DATOS -->
                <div class="mb-4">
                  <p class="border-bottom pb-1 color-white">
                    <font-awesome-icon class="me-1" icon="fa-solid fa-newspaper" />
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
                    <select class="form-select" v-model="actor.gender">
                      <option value="">Seleccione</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
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
                      v-model="actor.birthLocation"
                      :placeholder="actor.birthLocation"
                    />
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
                    v-model="actor.photo"
                    :placeholder="actor.photo"
                  />
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
import { ref, onMounted, onUnmounted, computed } from "vue";
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

// Composables
const toast = useToast();

// Let
let unsubscribe;
let unsubscribeMovies;

// Refs
const actors = ref([]);
const movies = ref([]);
const actorId = ref(null);
const selectedActor = ref(null);
const editingActor = ref("");
const activeFilter = ref("");

// Computed

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
  selectedActor.value = actor;
  if (editingActor.value === actor.id) editingActor.value = "";
  else editingActor.value = actor.id;
};

const editActor = async (actor) => {
  await updateActor(actor.id, actor);
  toast.success("Se ha editado correctamente el actor.");
  editingActor.value = "";
};

/**
 * Method to delete actors from the database
 * First, it shows a message to confirm whether the user wants to delete the data
 * If so, it deletes the data from the database and notifies the user
 */

const removeActor = async (id) => {
  await deleteActor(id, toDeleteMovies.value);
  toast.success("Se ha eliminado correctamente el actor.");
};

const sortedActors = computed(() => {
  const copy = [...actors.value];

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
