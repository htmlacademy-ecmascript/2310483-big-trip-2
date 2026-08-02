const FiltersOptions = [
  {
    id: 'filter-everything',
    name: 'Everything',
    value: 'everything',
  },
  {
    id: 'filter-future',
    name: 'Future',
    value: 'future'
  },
  {
    id: 'filter-present',
    name: 'Present',
    value: 'present'
  },
  {
    id: 'filter-past',
    name: 'Past',
    value: 'past'
  }
];

const SortOptions = [
  {
    id: 'sort-day',
    name: 'Day',
    value: 'sort-day',
    class: 'trip-sort__item--day'
  },
  {
    id: 'sort-event',
    name: 'Event',
    value: 'sort-event',
    class: 'trip-sort__item--event',
  },
  {
    id: 'sort-time',
    name: 'Time',
    value: 'sort-time',
    class: 'trip-sort__item--time'
  },
  {
    id: 'sort-price',
    name: 'Price',
    value: 'sort-price',
    class: 'trip-sort__item--price'
  },
  {
    id: 'sort-offer',
    name: 'Offers',
    value: 'sort-offer',
    class: 'trip-sort__item--offer'
  }
];

const EVENT_TYPES = [
  'flight',
  'taxi',
  'check-in',
  'sightseeing',
  'drive',
  'bus',
  'ship',
  'train',
  'restaurant'
];

export {
  FiltersOptions,
  SortOptions,
  EVENT_TYPES
};
