export const convertGenres = (genres, totalGenres) => {
  return genres
    .map((id) => totalGenres.find((g) => g.id === id)?.name)
    .filter(Boolean)
    .join(", ");
};
