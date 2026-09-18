import { eventPointDataGenerator, citiesListGenerator, offersListGenerator } from '../../fake-api/services/fake-data-generators.js';
import { EVENT_TYPES } from '../constants.js';
import Observable from '../../framework/observable.js';

const POINTS_COUNT = 10;

export default class PointsModel extends Observable {
  #points = Array.from({length: POINTS_COUNT}, () => eventPointDataGenerator());
  #destinations = citiesListGenerator();
  #offersData = offersListGenerator(EVENT_TYPES);

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = [...points];
  }

  updatePoint(updatedPoint) {
    const pointIndex = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (pointIndex === -1) {
      return;
    }

    this.#points[pointIndex] = updatedPoint;
  }

  deletePoint(pointId) {
    const pointIndex = this.#points.findIndex((point) => point.id === pointId);
    if (pointIndex === -1) {
      return;
    }

    this.#points = this.#points.filter((point) => point.id !== pointId);
  }

  get destinations() {
    return this.#destinations;
  }

  get offersData() {
    return this.#offersData;
  }
}
