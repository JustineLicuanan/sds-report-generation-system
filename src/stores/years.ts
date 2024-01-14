const startYear = 1903;
const endYear = new Date().getFullYear() + 8;

const years: number[] = [];
for (let i = endYear; i >= startYear; i--) {
  years.push(i);
}

export { years };
