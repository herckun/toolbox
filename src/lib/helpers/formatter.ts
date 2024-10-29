export const numbersFormatter = Intl.NumberFormat("en", {
  notation: "compact",
});

export const pluralize = (count: number, singular: string, plural: string) => {
  return count === 1 ? singular : plural;
};

export const humanizeDate = (date: string) => {
  return new Date(date).toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
