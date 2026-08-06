import MainPresenter from './presenters/main-presenter.js';
import TripModel from './fake-api/models/trip-model.js';

const containers = {
  filters: document.querySelector('.trip-controls__filters'),
  main: document.querySelector('.trip-events'),
};
const {points, destinations, offersData} = new TripModel().getTripData();
const presenter = new MainPresenter(
  {
    containers,
    points,
    destinations,
    offersData
  });
presenter.init();
