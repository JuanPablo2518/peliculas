import {
  between,
  minLength,
  numeric,
  required,
  url,
  integer,
} from "@vuelidate/validators";
export const getMovieRules = () => {
  const actualYear = new Date().getFullYear();

  return {
    name: { required, minLength: minLength(4) },
    year: { required, integer, between: between(1900, actualYear + 5) },
    poster: { url },
    synopsis: { required, minLength: minLength(10) },
    backdrop: { url },
    vote_average: { numeric, between: between(0, 10) },
    vote_count: { numeric },
    tagline: { minLength: minLength(6) },
    budget: { numeric },
    revenue: { numeric },
    runtime: { required, numeric, between: between(1, 240) },
    actors: { required },
    genres: { required },
  };
};
