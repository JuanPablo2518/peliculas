import { getTMDBGenres } from "@/services/tmdbService";
import { defineStore } from "pinia";

export const useGenresStore = defineStore("genres", {
  state: () => ({
    genres: [],
    loaded: false,
  }),
  actions: {
    async getGenres() {
      if (this.loaded) return this.genres;

      const response = await getTMDBGenres();

      this.genres = response.genres;
      this.loaded = true;

      return this.genres;
    },
  },
});
