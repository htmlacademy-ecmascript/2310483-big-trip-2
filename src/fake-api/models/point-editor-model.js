import { citiesListGenerator, offersListGenerator } from '../services/fake-data-generators.js';
import { EventTypes } from '../../api/constants.js';

export default class ModalPointModel {
  #destinationsList = citiesListGenerator();
  #offersData = offersListGenerator(EventTypes);


  get data() {
    return {
      destinationsList: this.#destinationsList,
      offersData: this.#offersData,
    };
  }
}
