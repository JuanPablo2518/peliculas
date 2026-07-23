export const convertMinutes = (minutes) => {
  const hours = Math.trunc(minutes / 60);
  return [hours, minutes - hours * 60];
};
