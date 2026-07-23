<!-- MovieCard Component
This is the component for the movie cards displayed in MovieView -->
<template>
  <div class="card h-100 d-flex flex-column movie-card">
    <div class="overflow-hidden position-relative" style="aspect-ratio: 3/4">
      <img
        :src="movie.poster"
        class="card-img-top movie-img w-100 h-100"
        alt="..."
      />
      <button
        @click="toggleFavorite"
        class="btn position-absolute top-0 end-0 m-2 like-button"
      >
        <font-awesome-icon
          icon="fa-solid fa-heart responsive-icon"
          :style="{ color: isFavorite ? 'red' : 'white' }"
        />
      </button>

      <span
        class="year-card position-absolute bottom-0 start-0 m-2 py-1 px-2 rounded-3"
        >{{ movie.year }}</span
      >
    </div>
    <div class="card-body d-flex flex-column gap-2">
      <h5 class="card-title text-light">{{ movie.name }}</h5>

      <p class="card-text card-details">
        <span class="me-3">
          <font-awesome-icon icon="fa-solid fa-user-group responsive-icon" />
          Actores: {{ movie.actors ? movie.actors.length : 0 }}
        </span>
        <span>
          <font-awesome-icon icon="fa-solid fa-tag responsive-icon" />
          Genres {{ movie.genres ? movie.genres.length : 0 }}
        </span>
      </p>

      <div class="d-flex flex-wrap gap-3 mb-3">
        <p
          v-for="genre in genres.slice(0, 3)"
          :key="genre.id"
          class="d-flex mb-0 card-genres small rounded-5 py-1 px-3"
        >
          {{ genre }}
        </p>
      </div>
      <a href="#" class="btn btn-yellow text-white mt-auto">
        <font-awesome-icon icon="fa-solid fa-circle-info" />
        Ver detalles</a
      >
    </div>
  </div>
</template>

<script setup>
// VUE Libraries
import { computed } from "vue";
import { useToast } from "vue-toastification";
// Services
import { addFavorite, removeFavorite } from "@/services/favoriteService";
// Stores
import { useLoginStore } from "@/stores/loginStore";
import { useMoviesStore } from "@/stores/moviesStore";

// Props

const props = defineProps({
  movie: Object,
  genres: Array,
});

// Emits (from MovieView)

const emit = defineEmits(["delete"]);

// Composables

const loginStore = useLoginStore();
const moviesStore = useMoviesStore();

const toast = useToast();

// Computed

// Computed function that checks in the store if the current user is an admin

const isAdmin = computed(() => loginStore.role === "admin");

// Computed function that calculates the movies that are in favorites

const isFavorite = computed(() => {
  return moviesStore.favoritesId.includes(props.movie.id);
});

// Methods

/** Method to assign a movie to the form for editing
 * This function will only be available for the edit movies button modal
 */

const sendEdit = () => {
  moviesStore.setMovie(props.movie);
};

/** Method for the favorites functionality
 * Allows marking and unmarking favorites
 * If a user tries to mark a favorite, it returns null
 */

const toggleFavorite = async () => {
  const user = loginStore.user;

  if (!user) {
    toast.warning("¡Debes iniciar sesión para marcar favoritos!");
    return;
  }

  if (isFavorite.value) {
    const favorite = moviesStore.favorites.find(
      (f) => f.movieId === props.movie.id,
    );

    if (favorite) await removeFavorite(favorite.id, props.movie.id);
  } else {
    await addFavorite(user.uid, props.movie.id);
  }
};
</script>

<style scoped lang="scss">
@use "sass:color";
@use "@/assets/scss/abstracts/variables" as *;
@use "@/assets/scss/abstracts/mixins" as *;

.movie-img {
  object-fit: cover;
  object-position: center;
}

.like-button {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  color: white;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.05);
  }
}

.year-card {
  background: rgba(0, 0, 0, 0.6);
  color: $text-light;
}

.movie-card {
  background-color: color.adjust($secondary-color, $lightness: -2%);
  transition:
    transform 0.2s ease,
    border 0.2s ease;
  border: 3px solid color.adjust($secondary-color, $lightness: 10%);

  &:hover {
    border-bottom: 2px solid $primary-color;
    transform: scale(1.05);
  }
}

.card-details {
  color: color.adjust($color: $text-light, $lightness: -30%);
}

.card-genres {
  color: color.adjust($color: $text-light, $lightness: -30%);
  background-color: color.adjust($color: $secondary-color, $lightness: -8%);
}
</style>
