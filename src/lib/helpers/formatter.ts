export const numbersFormatter = Intl.NumberFormat("en", {
  notation: "compact",
});

export const pluralize = (count: number, singular: string, plural: string) => {
  return count === 1 ? singular : plural;
};
