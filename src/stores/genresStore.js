import { getTMDBGenres } from "@/services/tmdbService";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useGenresStore = defineStore("genres", () => {
  const genres = ref([]);
  const loaded = ref(false);

  const getGenres = async () => {
    if (loaded.value) return genres.value;

    const response = await getTMDBGenres();

    genres.value = response.genres;
    loaded.value = true;

    return genres.value;
  };

  return {
    genres,
    getGenres,
  };
});
