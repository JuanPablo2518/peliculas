<!-- genresForm component
This component is the form where genres can be created/updated -->

<template>
  <form
    @submit.prevent="submitForm"
    class="mb-4 p-4 d-flex justify-content-center"
  >
    <div class="p-4 w-100 w-lg-75 genres-form">
      <label class="form-label genres-label">Nombre de género</label>
      <div
        class="d-flex flex-column genres-form-fields flex-md-row align-items-md-start gap-3"
      >
        <div class="flex-grow-1">
          <input
            type="text"
            class="form-control genres-input w-100"
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
        </div>
        <button class="btn btn-yellow flex-shrink-0">
          <font-awesome-icon
            class="me-1 responsive-icon"
            icon="fa-solid fa-plus"
          />
          <span>Guardar</span>
        </button>
        <button
          type="button"
          class="btn btn-danger flex-shrink-0"
          @click="cancelEdit"
          v-if="props.genre"
        >
          <span>Cancelar Edición</span>
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
// VUE Libraries
import { ref, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";
import { useToast } from "vue-toastification";
// Services
import { getGenres } from "@/services/genreService";

// COMPOSABLES

const toast = useToast();

// PROPS

const props = defineProps({
  genre: Object,
});

// EMITS (from genresView)

const emit = defineEmits(["save", "cancel"]);

// REFS

const name = ref("");

// Vuelidate

const rules = {
  name: { required, minLength: minLength(3) },
};

const v$ = useVuelidate(rules, { name });

// METHODS

/**

* Method used to submit the form data
* Checks whether the value exists and meets the Vuelidate requirements
* If valid: uses the save emit defined in genresView, and resets the form
* If not valid, returns null
*/
const submitForm = async () => {
  const result = await v$.value.$validate();
  if (!result) return;

  const genres = await getGenres();

  if (props.genre?.name !== name.value) {
    if (
      genres.find(
        (g) => g.name.trim().toLowerCase() === name.value.trim().toLowerCase(),
      )
    ) {
      toast.warning("El género ingresado ya existe.");
      return;
    }
  }

  emit("save", {
    name: name.value,
  });

  name.value = "";
  v$.value.$reset();
};

const cancelEdit = () => {
  name.value = "";
  v$.value.$reset();
  emit("cancel");
};

// WATCHERS

// Watch used to assign the genre prop value after it loads
watch(
  () => props.genre,
  (newGenre) => {
    if (newGenre) {
      name.value = newGenre.name;
    }
  },
);
</script>

<style scoped lang="scss">
@use "sass:color";
@use "@/assets/scss/abstracts/variables" as *;
@use "@/assets/scss/abstracts/mixins" as *;

.genres-form {
  background-color: color.adjust($color: $secondary-color, $lightness: 4%);
  border-radius: 20px;
}

.genres-input {
  border: 2px solid color.adjust($color: $secondary-color, $lightness: 15%);

  &:focus {
    border: 2px solid $primary-color;
  }
}

.genres-label {
  color: color.adjust($color: $secondary-color, $lightness: 50%);
}
</style>
