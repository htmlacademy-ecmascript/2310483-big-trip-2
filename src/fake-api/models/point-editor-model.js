import { citiesListGenerator, offersListGenerator } from '../services/fake-data-generators.js';
import { EVENT_TYPES } from '../../api/constants.js';

export default class ModalPointModel {
  #destinationsList = citiesListGenerator();
  #offersData = offersListGenerator(EVENT_TYPES);


  get data() {
    return {
      destinationsList: this.#destinationsList,
      offersData: this.#offersData,
    };
  }
}
