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

const DEFAULT_FILTER = FiltersOptions[0].value;

const SortOptions = [
  {
    id: 'sort-day',
    name: 'Day',
    value: 'sort-day',
    class: 'trip-sort__item--day',
    disabled: false
  },
  {
    id: 'sort-event',
    name: 'Event',
    value: 'sort-event',
    class: 'trip-sort__item--event',
    disabled: true
  },
  {
    id: 'sort-time',
    name: 'Time',
    value: 'sort-time',
    class: 'trip-sort__item--time',
    disabled: false
  },
  {
    id: 'sort-price',
    name: 'Price',
    value: 'sort-price',
    class: 'trip-sort__item--price',
    disabled: false
  },
  {
    id: 'sort-offers',
    name: 'Offers',
    value: 'sort-offers',
    class: 'trip-sort__item--offer',
    disabled: true
  }
];

const DEFAULT_SORT_OPTION = SortOptions[0].value;

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

const EMPTY_POINT = {
  id: null,
  basePrice: '0',
  dateFrom: new Date(),
  dateTo: new Date(),
  destinationId: null,
  isFavorite: false,
  offersIds: [],
  type: EVENT_TYPES[0],
};

export {
  FiltersOptions,
  DEFAULT_FILTER,
  SortOptions,
  DEFAULT_SORT_OPTION,
  EVENT_TYPES, EMPTY_POINT
};
