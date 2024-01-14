export function getYearArray(minYear = 1903, maxYear = new Date().getFullYear() + 8) {
  const years: number[] = [];
  for (let i = maxYear; i >= minYear; i--) {
    years.push(i);
  }

  return years;
}
