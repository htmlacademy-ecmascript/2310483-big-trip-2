import {CITIES, PHOTOS, OffersOptions} from '../fake-data.js';
import {getRandomNumber} from '../../utils/functions.js';
import {EVENT_TYPES} from '../../api/constants.js';

const citiesListGenerator = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
  ];

  return CITIES.map((city, index) => ({
    id: index,
    description: descriptions[getRandomNumber(0, descriptions.length - 1)],
    name: city,
    pictures: Math.random() < 0.5 ? [] : Array.from({length: getRandomNumber(1, 5)}, () => PHOTOS[getRandomNumber(0, 4)]),
  }));
};

const offersListGenerator = (eventTypes) => eventTypes.map((type) => ({
  type: type,
  offers: OffersOptions,
}));

const eventPointDataGenerator = () => {
  const offersIds = new Set(Array.from({length: getRandomNumber(1, 5)}, () => OffersOptions[getRandomNumber(0, OffersOptions.length - 1)].id));
  return ({
    id: `${getRandomNumber(1, 1000)}`,
    basePrice: getRandomNumber(20, 1000),
    dateFrom: new Date(Date.now() + getRandomNumber(1000, 300000)),
    dateTo: new Date(Date.now() + getRandomNumber(300000, 60000000)),
    destinationId: citiesListGenerator()[getRandomNumber(0, CITIES.length - 1)].id,
    isFavorite: Math.random() < 0.5,
    offersIds: Array.from(offersIds),
    type: EVENT_TYPES[getRandomNumber(0, EVENT_TYPES.length - 1)],
  });
};

export {
  offersListGenerator,
  eventPointDataGenerator,
  citiesListGenerator
};
