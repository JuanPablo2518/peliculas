export const getGenresMovies = (genreId, movies) => {
  return movies.filter(
    (movie) => movie.genres && movie.genres.includes(genreId),
  );
};
