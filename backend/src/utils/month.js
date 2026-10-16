import { ApiError } from './ApiError.js';

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export const currentMonth = () => new Date().toISOString().slice(0, 7);

export const parseMonth = (value) => {
  if (!MONTH_REGEX.test(value)) {
    throw new ApiError(400, 'Month must look like YYYY-MM');
  }
  return value;
};

// Start (inclusive) and end (exclusive) of a month, in UTC
export const monthRange = (month) => {
  const [year, monthNumber] = month.split('-').map(Number);
  return {
    start: new Date(Date.UTC(year, monthNumber - 1, 1)),
    end: new Date(Date.UTC(year, monthNumber, 1)),
  };
};
