<!-- RegisterView -->

<template>
  <div v-if="!loading" class="container my-4 my-md-5 pt-3 pt-md-5">
    <div class="row justify-content-center mx-0">
      <!-- Register Card -->
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 border rounded p-4 p-sm-5 shadow">
        <!-- Title -->
        <h2 class="text-center mb-4 mb-md-5">Formulario de registro</h2>
        <!-- Form -->
        <form @submit.prevent="signUp">
          <!-- Name Field -->
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': v$.name.$error }"
              v-model="name"
            />
            <div v-if="v$.name.required.$invalid" class="invalid-feedback">
              El nombre es obligatorio.
            </div>
          </div>
          <!-- Email Field -->
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': v$.email.$error }"
              v-model="email"
            />
            <div class="invalid-feedback" v-if="v$.email.required.$invalid">
              El correo es obligatorio.
            </div>
            <div class="invalid-feedback" v-if="v$.email.email.$invalid">
              Ingrese un formato de correo válido.
            </div>
            <div class="invalid-feedback" v-if="v$.email.isUnique.$invalid">
              Este correo ya está registrado.
            </div>
          </div>
          <!-- Password Field -->
          <div class="mb-4 mb-md-5">
            <label class="form-label">Contraseña</label>
            <input
              type="password"
              class="form-control"
              :class="{ 'is-invalid': v$.password.$error }"
              v-model="password"
            />
            <div v-if="v$.password.minLength.$invalid" class="invalid-feedback">
              La contraseña debe ser de un mínimo de 6 caracteres.
            </div>
            <div v-if="v$.password.required.$invalid" class="invalid-feedback">
              La contraseña es obligatoria.
            </div>
          </div>
          <!-- Submit Button -->
          <button class="btn btn-primary w-100 py-2">Registrarse</button>
        </form>
      </div>
    </div>
  </div>
  <!-- Loading Screen -->
  

  <!-- Loading Screen -->
  <div
    v-else
    class="d-flex min-vh-100 justify-content-center align-items-center"
  >
    <Spinner />
  </div>
</template>

<script setup>
// VUE Libraries
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  helpers,
  required,
  email as emailValidator,
  minLength,
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useToast } from "vue-toastification";
// Services
import {
  register,
  getUserRole,
  checkEmailExists,
} from "@/services/authService";
// Components
import Spinner from "@/components/Spinner.vue";
// Utils
import { convertErrors } from "@/utils/errorMessages";
// Stores
import { useLoginStore } from "@/stores/loginStore";

// Composables
const loginStore = useLoginStore();
const router = useRouter();
const toast = useToast();

// Refs
const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);

// Methods

/**
 * Method to verify if the entered email already exists
 * Uses the checkEmailsExists method; returns true if the email does not exist
 */

const isUniqueEmail = async (value) => {
  // If it is empty or the format is invalid, do not execute the Firebase query
  if (!value || !emailValidator.$validator(value)) return true;
  const exists = await checkEmailExists(value);
  return !exists;
};

/**
 * Method to handle account registration
 * First, it activates the loading screen
 * Then, it checks whether the entered data meets the requirements defined by Vuelidate
 * After that, it uses the register method to create the account and then stores the data in the store
 * In case of an error, it notifies the user with a toast
 */

const signUp = async () => {
  try {
    const result = await v$.value.$validate();

    if (!result) return;

    loading.value = true;

    const user = await register(email.value, password.value, name.value);

    loginStore.setUser(user);

    const role = await getUserRole(user.uid);

    loginStore.setRole(role);

    router.push("/peliculas");

    v$.value.$reset();
    toast.success("Se ha creado la cuenta exitosamente.");
  } catch (error) {
    toast.error(
      "Ha ocurrido un error al crear la cuenta:" + convertErrors(error),
    );
  } finally {
    loading.value = false;
  }
};

// Vuelidate

const rules = {
  email: {
    required,
    email: emailValidator,
    isUnique: helpers.withAsync(isUniqueEmail),
  },
  name: {
    required,
  },
  password: {
    required,
    minLength: minLength(6),
  },
};

const v$ = useVuelidate(rules, { name, email, password });
</script>

<style scoped></style>
