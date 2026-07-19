import { eventPointDataGenerator } from '../services/fake-data-generators';

const POINTS_COUNT = 10;

export default class EventPointsListModel {
  points = Array.from({length: POINTS_COUNT}, () => eventPointDataGenerator());

  getEventPointList() {
    return this.points;
  }
}
