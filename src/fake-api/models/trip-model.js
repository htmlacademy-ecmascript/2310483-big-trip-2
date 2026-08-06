import { eventPointDataGenerator, citiesListGenerator, offersListGenerator } from '../services/fake-data-generators';
import { EVENT_TYPES } from '../../api/constants.js';

const POINTS_COUNT = 10;

export default class EventPointsListModel {
  #points = Array.from({length: POINTS_COUNT}, () => eventPointDataGenerator());
  #destinations = citiesListGenerator();
  #offersData = offersListGenerator(EVENT_TYPES);

  getTripData() {
    return {
      points: this.#points,
      destinations: this.#destinations,
      offersData: this.#offersData
    };
  }
}
