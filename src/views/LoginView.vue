<!-- LoginView -->

<template>
  <div v-if="!loading" class="container my-4 my-md-5 pt-3 pt-md-5">
    <div class="row justify-content-center mx-0">
      <!-- Login Card (12 cols en móvil, 8 en tablet, 6 en escritorio medio, 4 en pantallas muy grandes) -->
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 border rounded p-4 p-sm-5 shadow">
        <!-- Title -->
        <h2 class="text-center mb-4 mb-md-5">Iniciar sesión</h2>
        <!-- Login Form -->
        <form @submit.prevent="logIn" class="mb-3">
          <!-- Email Field -->
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="text" class="form-control" v-model="email" />
          </div>
          <!-- Password Field -->
          <div class="mb-4 mb-md-5">
            <label class="form-label">Contraseña</label>
            <input type="password" class="form-control" v-model="password" />
          </div>
          <!-- Login Button -->
          <button class="btn btn-primary w-100 py-2">Iniciar sesión</button>
        </form>
        <!-- Register Link -->
        <div class="text-center">
          <router-link to="/registrar" class="mt-3 d-inline-block">Registrarse</router-link>
        </div>
      </div>
    </div>
  </div>
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
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
// Stores
import { useLoginStore } from "@/stores/loginStore";
// Services
import { login, getUserRole, getUserProfile } from "@/services/authService";
// Components
import Spinner from "@/components/Spinner.vue";
// Utils
import { convertErrors } from "@/utils/errorMessages";

// Composables
const loginStore = useLoginStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

// Refs
const loading = ref(false);
const email = ref("");
const password = ref("");

// Methods

/**
 * Method that allows users to log in
 * First, it uses the login method to verify the credentials in the database
 * If they exist, it returns information such as the role and profile, and stores it in the store
 * Then it redirects to the movies page and shows a welcome toast
 * In case of an error, it displays the error in a toast
 */

const logIn = async () => {
  loading.value = true;
  try {
    const user = await login(email.value, password.value);

    loginStore.setUser(user);

    const role = await getUserRole(user.uid);

    loginStore.setRole(role);

    const profile = await getUserProfile(user.uid);

    loginStore.setUserProfile(profile);

    const redirect = route.query.redirect || "/peliculas";
    router.push(redirect);

    toast.success(`Bienvenido: ${profile.name}`);
  } catch (error) {
    toast.error("Vaya, algo salió mal: " + convertErrors(error));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped></style>
