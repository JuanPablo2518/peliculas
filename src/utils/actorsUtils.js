export const getActorMovies = (actorId, movies) => {
  return movies.filter(
    (movie) => movie.actors && movie.actors.includes(actorId),
  );
};
