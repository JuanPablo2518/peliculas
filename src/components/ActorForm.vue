<!-- ActorForm component
This component is the form where actors can be created/updated -->

<template>
  <TMDBInput :type="'Actor'" @select="insertActor" />

  <form
    @submit.prevent="submitForm"
    class="mb-4 p-4 d-flex flex-column align-items-center justify-content-center"
  >
    <div class="p-4 w-100 w-lg-75 actors-form justify-content-end">
      <label class="form-label actors-label">Nombre del actor</label>
      <div class="d-flex flex-column flex-md-row align-items-md-start gap-3">
        <div class="flex-grow-1">
          <input
            type="text"
            class="form-control   w-100"
            :class="{ 'is-invalid': v$.name.$error }"
            v-model="name"
          />
          <div class="invalid-feedback" v-if="v$.name.required.$invalid">
            Por favor, ingrese un nombre
          </div>
          <div class="invalid-feedback" v-if="v$.name.minLength.$invalid">
            El nombre debe ser de al menos
            {{ v$.name.minLength.$params.min }} caracteres.
          </div>
          <p class="form-label actors-label mt-2" v-if="resetTMDBPopularity">
            El campo "Popularidad TMDB" a sido eliminado:
            <a
              class="text-decoration-underline"
              style="cursor: pointer"
              @click="restoreTMDB"
              >Reestablecer</a
            >
          </p>
        </div>
      </div>

      <label class="form-label actors-label mt-4">Foto (URL)</label>
      <div class="d-flex flex-column flex-md-row align-items-md-start gap-3">
        <div class="flex-grow-1">
          <input
            type="text"
            class="form-control   w-100"
            :class="{ 'is-invalid': v$.photo.$error }"
            v-model="photo"
          />
          <div class="invalid-feedback" v-if="photo && v$.photo.url.$invalid">
            La URL ingresada es incorrecta.
          </div>
        </div>
      </div>

      <label class="form-label actors-label mt-4">Biografia</label>
      <div class="d-flex flex-column flex-md-row align-items-md-start gap-3">
        <div class="flex-grow-1">
          <textarea
            type="text"
            class="form-control   w-100"
            :class="{ 'is-invalid': v$.biography.$error }"
            v-model="biography"
          ></textarea>
          <div class="invalid-feedback" v-if="v$.biography.minLength.$invalid">
            La biografia debe ser de al menos
            {{ v$.biography.minLength.$params.min }} caracteres.
          </div>
        </div>
      </div>

      <div
        class="d-flex flex-md-row gap-md-5 flex-column justify-content-between"
      >
        <div class="w-100 w-md-50">
          <label class="form-label actors-label mt-4"
            >Fecha de nacimiento</label
          >
          <div
            class="d-flex flex-column flex-md-row align-items-md-start gap-3"
          >
            <div class="flex-grow-1">
              <input
                type="date"
                class="form-control   w-100"
                :class="{ 'is-invalid': v$.yearBirthDate.$error }"
                v-model="dateOfBirth"
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
          </div>
        </div>

        <div class="w-100 w-md-50">
          <div class="form-check form-switch mt-4">
            <input
              class="form-check-input"
              type="checkbox"
              id="checkNativeSwitch"
              switch
              v-model="enabledDD"
            />
            <label
              class="form-check-label form-label actors-label"
              for="checkNativeSwitch"
            >
              Fecha fallecimiento
            </label>
          </div>
          <div
            class="d-flex flex-column flex-md-row align-items-md-start gap-3"
          >
            <div class="flex-grow-1">
              <input
                type="date"
                :disabled="!enabledDD"
                class="form-control   w-100"
                :class="{ 'is-invalid': v$.yearDeathDate.$error }"
                v-model="dateOfDeath"
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
      </div>

      <div
        class="d-flex flex-column flex-md-row justify-content-between gap-md-3"
      >
        <div class="w-100">
          <label class="form-label actors-label mt-4">Genero</label>
          <div
            class="d-flex flex-column flex-md-row align-items-md-start gap-3"
          >
            <div class="flex-grow-1">
              <select
                class="form-select   w-100"
                :class="{ 'is-invalid': v$.gender.$error }"
                v-model="gender"
              >
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
          </div>
        </div>

        <div class="w-100">
          <label class="form-label actors-label mt-4"
            >Ubicacion de nacimiento</label
          >
          <div
            class="d-flex flex-column flex-md-row align-items-md-start gap-3"
          >
            <div class="flex-grow-1">
              <input
                type="text"
                class="form-control   w-100"
                :class="{ 'is-invalid': v$.birthLocation.$error }"
                v-model="birthLocation"
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
        </div>

        <div class="w-100">
          <label class="form-label actors-label mt-4">Popularidad TMDB</label>
          <div
            class="d-flex flex-column flex-md-row align-items-md-start gap-3"
          >
            <div class="flex-grow-1">
              <input
                type="text"
                class="form-control   w-100"
                v-model="tmdbPopularity"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-end mt-3">
        <button class="btn btn-yellow align-items-center mt-4 px-4 py-2">
          <font-awesome-icon icon="fa-solid fa-floppy-disk responsive-icon" />
          Guardar
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
// VUE Libraries
import { computed, reactive, ref, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import {
  between,
  minLength,
  required,
  requiredIf,
  url,
} from "@vuelidate/validators";
import { useToast } from "vue-toastification";
// Services
import { getActors } from "@/services/actorService";
import { searchTMDBActors, getTMDBActorsDetails } from "@/services/tmdbService";
import TMDBInput from "./TMDBInput.vue";

// COMPOSABLES
const toast = useToast();

// PROPS

// Constants
const actualYear = new Date().getFullYear();

// EMITS (from actorsView)
const emit = defineEmits(["save", "cancel"]);

// REFS
const name = ref("");
const biography = ref("");
const dateOfBirth = ref("");
const dateOfDeath = ref("");
const enabledDD = ref(false);
const gender = ref("");
const birthLocation = ref("");
const tmdbPopularity = ref(0);
const tmdbId = ref(null);
const photo = ref("");

const tmdbSearchTerm = ref("");
const tmdbResults = ref([]);
const resetTMDBPopularity = ref(false);
const tmdbOriginalName = ref(null);

// COMPUTED
const yearBirthDate = computed(() => Number(dateOfBirth.value.split("-")[0]));
const yearDeathDate = computed(() => Number(dateOfDeath.value.split("-")[0]));

// Vuelidate
const oneOfGender = (value) => ["M", "F"].includes(value);

const rules = computed(() => ({
  name: { required, minLength: minLength(4) },
  biography: { minLength: minLength(50) },
  yearBirthDate: { required, between: between(1900, actualYear) },
  yearDeathDate: {
    required: requiredIf(enabledDD),
    between: enabledDD.value ? between(1900, actualYear) : {},
  },
  gender: { oneOfGender },
  birthLocation: { minLength: minLength(10) },
  photo: { url },
}));

const state = reactive({
  name,
  biography,
  yearBirthDate,
  yearDeathDate,
  gender,
  birthLocation,
  photo,
});
const v$ = useVuelidate(rules, state);

// METHODS

/**
 * Method used to submit the form data
 * Checks whether the value exists and meets the Vuelidate requirements
 * If valid: uses the save emit defined in actorsView, and resets the form
 * If not valid, returns null
 */
const submitForm = async () => {
  const result = await v$.value.$validate();
  if (!result) return;

  const actors = await getActors();

  if (
    actors.find(
      (a) => a.name.trim().toLowerCase() === name.value.trim().toLowerCase(),
    )
  ) {
    toast.warning("El actor ingresado ya existe.");
    return;
  }

  emit("save", {
    name: name.value,
    biography: biography.value,
    dateOfBirth: dateOfBirth.value,
    dateOfDeath: dateOfDeath.value,
    gender: gender.value,
    birthLocation: birthLocation.value,
    tmdbPopularity: tmdbPopularity.value,
    tmdbId: tmdbId.value,
    photo: photo.value,
  });

  resetForm();
  v$.value.$reset();
};

const searchInTMDB = async () => {
  if (tmdbSearchTerm.value.length < 3) {
    tmdbResults.value = [];
    return;
  }
  tmdbResults.value = await searchTMDBActors(tmdbSearchTerm.value);
};

const insertActor = async (id) => {
  const actor = await getTMDBActorsDetails(id);

  name.value = actor.name;
  tmdbOriginalName.value = actor.name;
  biography.value = actor.biography;
  dateOfBirth.value = actor.birthday || "";
  dateOfDeath.value = actor.deathday || "";
  gender.value = actor.gender !== 2 ? "F" : "M";
  birthLocation.value = actor.place_of_birth;
  tmdbPopularity.value = actor.popularity;
  photo.value = actor.profile_path
    ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
    : "";
  tmdbId.value = id;
};

const resetForm = () => {
  name.value = "";
  biography.value = "";
  dateOfBirth.value = "";
  dateOfDeath.value = "";
  gender.value = "";
  birthLocation.value = "";
  tmdbPopularity.value = "";
  tmdbId.value = null;
  photo.value = "";
};

const restoreTMDB = async () => {
  const actorToRestore = await searchTMDBActors(tmdbOriginalName.value);

  if (!actorToRestore) return;

  name.value = actorToRestore[0].name;
  tmdbPopularity.value = actorToRestore[0].popularity;
  tmdbId.value = actorToRestore[0].id;
  resetTMDBPopularity.value = false;
};

// WATCHERS

watch(enabledDD, (value) => {
  if (!value) dateOfDeath.value = "";
});

watch(name, (newValue) => {
  if (!tmdbId.value) return;

  const nameChanged = newValue !== tmdbOriginalName.value;
  resetTMDBPopularity.value = nameChanged;

  if (nameChanged) {
    tmdbId.value = null;
    tmdbPopularity.value = null;
  }
});
</script>

<style scoped lang="scss">
@use "sass:color";
@use "@/assets/scss/abstracts/variables" as *;
@use "@/assets/scss/abstracts/mixins" as *;

.date-check {
  outline: none;
  background-color: $secondary-color;
  border: 2px solid $primary-color;

  &:checked {
    background-color: $primary-color;
    border: none;
  }

  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 3px rgba($primary-color, 0.2);
    color: $text-light;
  }
}

input::placeholder {
  color: rgb(233, 226, 226);
  opacity: 0.5;
}

.tmdb-search-button.list-group-item {
  background-color: $secondary-color;
  border: 2px solid color.adjust($color: $secondary-color, $lightness: 4%);
  border-top: 0;
  color: white;

  &:hover {
    background-color: color.adjust($color: $secondary-color, $lightness: 2%);
  }
}

.tmdb-search-button:first-child {
  border-top: 0px solid red;
}

.actors-form {
  background-color: color.adjust($color: $secondary-color, $lightness: 4%);
  border-radius: 20px;
}



.actors-label {
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
</style>
