import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const getRandomNumber = (min, max) => Math.round(Math.random() * (max - min) + min);

export const FiltersCb = {
  'everything': () => true,
  'future': (point) => dayjs(point.dateFrom).isAfter(dayjs()),
  'past': (point) => dayjs(point.dateTo).isBefore(dayjs()),
  'present': (point) => dayjs().isBetween(dayjs(point.dateFrom), dayjs(point.dateTo)),
};

export const SortCb = {
  'sort-day': (a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)),
  'sort-time': (a, b) => dayjs(a.dateFrom).diff(dayjs(a.dateTo)) - dayjs(b.dateFrom).diff(dayjs(b.dateTo)),
  'sort-price': (a, b) => b.basePrice - a.basePrice
};

