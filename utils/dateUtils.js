export const months = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' }
];

export const generateMonthOptions = () => {
  return months.map(month => (
    <option key={month.value} value={month.value}>
      {month.label}
    </option>
  ));
};

export const generateYearOptions = (pastYears = 4) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  for (let year = currentYear; year >= currentYear - pastYears; year--) {
    years.push(year);
  }
  
  return years.map(year => (
    <option key={year} value={year}>{year}</option>
  ));
};

export const getCurrentMonth = () => new Date().getMonth() + 1;
export const getCurrentYear = () => new Date().getFullYear();
