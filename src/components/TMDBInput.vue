<template>
  <div class="mb-4 p-4 d-flex justify-content-center">
    <div class="p-4 w-100 w-lg-75 actors-form">
      <label class="form-label tmdb-label">
        ⚡ Buscar por TMDB para autocompletar</label
      >
      <div
        class="d-flex flex-column genres-form-fields flex-md-row align-items-md-start gap-3"
      >
        <div class="flex-grow-1 position-relative">
          <input
            type="text"
            class="form-control   w-100 mb-2"
            :placeholder="placeholder"
            v-model="tmdbSearchTerm"
            @input="searchInTMDB"
          />
          <div
            class="list-group mt-1 position-absolute w-100 shadow overflow-y-auto"
            v-if="tmdbResults?.length"
            style="z-index: 1000; max-height: 500px"
          >
            <button
              type="button"
              v-for="res in tmdbResults"
              :key="res.id"
              class="tmdb-search-button list-group-item list-group-item-action d-flex align-items-center"
              @click="selectTMDBData(res.id)"
            >
              <img
                :src="
                  res.image
                    ? 'https://image.tmdb.org/t/p/w92' + res.image
                    : actorPlaceholder
                "
                class="me-3 rounded"
                style="width: 40px"
              />
              <div
                class="d-flex flex-column flex-sm-row justify-content-center justify-content-sm-between align-items-start h-100 w-100"
              >
                <div class="d-flex flex-column">
                  <p class="d-inline mb-0">
                    {{ res.title }}
                  </p>
                  <small class="department-tmdb">{{ res.subtitle }}</small>
                </div>

                <p class="popularity-tmdb mb-0">
                  <font-awesome-icon icon="fa-solid fa-star" />
                  {{ res.tmdbPopularity }}
                </p>
              </div>
            </button>
          </div>
          <div class="mt-3" v-else-if="tmdbResults.length === 0 && tmdbSearchTerm.length > 3">
              <p class="mb-0">Sin resultados</p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { searchTMDBActors, searchTMDBMovies } from "@/services/tmdbService";
import { convertGenres } from "@/utils/tmdbUtils";
import { useGenresStore } from "@/stores/genresStore";
import actorPlaceholder from "@/assets/img/actorPlaceholder.png";

const genresStore = useGenresStore();

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ["Actor", "Movie"].includes(value),
  },
});

const placeholder = computed(() => {
  if (props.type === "Actor") {
    return "Escriba el nombre de un actor...";
  }

  return "Escriba el nombre de una película...";
});

const emit = defineEmits(["select"]);

const tmdbSearchTerm = ref("");
const tmdbResults = ref([]);

onMounted(async () => {
  if (props.type === "Movie") await genresStore.getGenres();
});

let debounceTimeout = null

const searchInTMDB = async () => {

  clearTimeout(debounceTimeout)
  if (tmdbSearchTerm.value.length < 3) {
    tmdbResults.value = [];
    return;
  }

  debounceTimeout = setTimeout(async () => {
      if (props.type === "Actor") {
    tmdbResults.value = (await searchTMDBActors(tmdbSearchTerm.value)).map(
      (actor) => ({
        id: actor.id,
        title: actor.name,
        subtitle: actor.known_for_department,
        tmdbPopularity: actor.popularity,
        image: actor.profile_path,
      }),
    );
  } else {
    tmdbResults.value = (await searchTMDBMovies(tmdbSearchTerm.value)).map(
      (movie) => ({
        id: movie.id,
        title: movie.title,
        subtitle: convertGenres(movie.genre_ids, genresStore.genres),
        tmdbPopularity: movie.popularity,
        image: movie.poster_path,
      }),
    );
  }
  }, 300)
};

const selectTMDBData = (id) => {
  emit("select", id);
  tmdbResults.value = [];
  tmdbSearchTerm.value = "";
};
</script>

<style scoped lang="scss">
@use "sass:color";
@use "@/assets/scss/abstracts/variables" as *;
@use "@/assets/scss/abstracts/mixins" as *;

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
