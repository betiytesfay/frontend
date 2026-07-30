import { toEthiopian } from 'ethiopian-date';

export const getEthiopianDateString = (date = new Date()) => {
  const [etYear, etMonth, etDay] = toEthiopian(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return `${etYear}-${String(etMonth).padStart(2, '0')}-${String(etDay).padStart(2, '0')}`;
};

export const formatEthiopianDate = (year, month, day) => {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};
