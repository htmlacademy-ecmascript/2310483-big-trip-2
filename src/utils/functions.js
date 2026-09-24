import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

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

dayjs.extend(isBetween);

export const getSelectedOffersIds = (acc, point) => [...acc, ...point.offersIds];

export const reduceSelectedOffersPrice = (acc, offer) => acc + offer.price;

export const getSelectedOffersPrice = (points, offersData) => {
  const offers = offersData.reduce((acc, item) => [...acc, ...item.offers], []);
  const selectedOffers = points.reduce(getSelectedOffersIds, []);
  return selectedOffers
    .map((id) => offers.find((offer) => offer.id === id))
    .reduce(reduceSelectedOffersPrice, 0);
};
