import {cities, photos, offersOptions} from '../fake-data.js';
import {getRandomNumber} from '../../utils/functions.js';
import {EventTypes} from '../../api/constants.js';

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

  return cities.map((city, index) => ({
    id: index,
    description: descriptions[getRandomNumber(0, descriptions.length - 1)],
    name: city,
    pictures: Math.random() < 0.5 ? [] : Array.from({length: getRandomNumber(1, 5)}, () => photos[getRandomNumber(0, 4)]),
  }));
};

const offersListGenerator = (eventTypes) => eventTypes.map((type) => ({
  type: type,
  offers: offersOptions,
}));

const eventPointDataGenerator = () => ({
  id: `${getRandomNumber(1, 1000)}`,
  basePrice: getRandomNumber(20, 1000),
  dateFrom: new Date(Date.now()),
  dateTo: new Date(Date.now() + getRandomNumber(5000, 60000000)),
  destinationId: citiesListGenerator()[getRandomNumber(0, cities.length - 1)].id,
  isFavorite: Math.random() < 0.5,
  offersIds: Array.from({length: getRandomNumber(1, 5)}, () => offersOptions[getRandomNumber(0, offersOptions.length - 1)].id),
  type: EventTypes[getRandomNumber(0, EventTypes.length - 1)],
});

export {
  offersListGenerator,
  eventPointDataGenerator,
  citiesListGenerator
};
