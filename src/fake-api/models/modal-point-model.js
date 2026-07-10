import { citiesListGenerator, offersListGenerator } from '../services/fake-data-generators.js';
import { EventTypes } from '../../api/constants.js';

export default class ModalPointModel {
  eventTypes = EventTypes;
  destinationsList = citiesListGenerator();
  offersData = offersListGenerator(EventTypes);
  currentEventType = EventTypes[0];
  currentDestination = this.destinationsList[0];

  setCurrentEventType(type) {
    this.currentEventType = type;
  }

  getOffersListByType() {
    const result = this.offersData.filter((item) => item.type === this.currentEventType)[0];
    return result.offers;
  }

  getModalPointData() {
    return {
      eventTypes: this.eventTypes,
      currentType: this.currentEventType,
      destinationsList: this.destinationsList,
      currentDestination: this.currentDestination,
      offersList: this.getOffersListByType() ?? []
    };
  }
}
