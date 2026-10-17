const currencyFormatter = new Intl.NumberFormat('en-RW', {
  style: 'currency',
  currency: 'RWF',
  maximumFractionDigits: 0,
});

export const formatCurrency = (value: number): string => currencyFormatter.format(value);

// Dates are stored at UTC midnight, so format in UTC to avoid showing the previous day
export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

// "2026-10-12T00:00:00.000Z" -> "2026-10-12" (the format <input type="date"> uses)
export const toInputDate = (iso: string): string => iso.slice(0, 10);

export const todayInputDate = (): string => new Date().toISOString().slice(0, 10);

// "YYYY-MM" for the current month
export const currentMonthKey = (): string => new Date().toISOString().slice(0, 7);

// Moves a "YYYY-MM" key forward or backward by a number of months
export const shiftMonth = (month: string, delta: number): string => {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Date(Date.UTC(year, monthNumber - 1 + delta, 1)).toISOString().slice(0, 7);
};

// "2026-10" -> "October 2026"
export const formatMonthLabel = (month: string): string => {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Date(Date.UTC(year, monthNumber - 1, 1)).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
};
