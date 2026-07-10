import Presenter from './presenter/presenter.js';
import EventPointsModel from './fake-api/models/event-points-model.js';
import ModalPointModel from './fake-api/models/modal-point-model.js';

const containers = {
  filters: document.querySelector('.trip-controls__filters'),
  main: document.querySelector('.trip-events'),
};
const eventPoints = new EventPointsModel().getEventPointList();
const modalPointModel = new ModalPointModel();

const presenter = new Presenter(containers, eventPoints, modalPointModel);
presenter.init();
