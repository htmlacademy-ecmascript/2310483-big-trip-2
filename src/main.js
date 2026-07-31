import MainPresenter from './presenters/main-presenter.js';
import EventPointsModel from './fake-api/models/event-points-model.js';
import PointEditorModel from './fake-api/models/point-editor-model.js';

const containers = {
  filters: document.querySelector('.trip-controls__filters'),
  main: document.querySelector('.trip-events'),
};
const points = new EventPointsModel().getEventPointList();
const pointEditorModel = new PointEditorModel();
const presenter = new MainPresenter(
  {
    containers,
    points,
    pointEditorModel
  });
presenter.init();
