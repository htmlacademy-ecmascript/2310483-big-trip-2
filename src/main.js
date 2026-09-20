import BoardPresenter from './presenters/board-presenter.js';
import FiltersPresenter from './presenters/filters-presenter.js';
import PointsModel from './api/models/points-model.js';
import FiltersModel from './api/models/filters-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { render, RenderPosition } from './framework/render.js';
import TripApiServices from './api/services/trip-api-services.js';
import InfoPresenter from './presenters/info-presenter.js';

const authToken = `Basic ${self.crypto.randomUUID()}`;
const BASE_URL = 'https://22.objects.htmlacademy.pro/big-trip';

const containers = {
  filters: document.querySelector('.trip-controls__filters'),
  main: document.querySelector('.trip-events'),
  tripMain: document.querySelector('.trip-main'),
};
const tripApiServices = new TripApiServices(BASE_URL, authToken);
const pointsModel = new PointsModel(tripApiServices);
const filtersModel = new FiltersModel();
const tripInfoPresenter = new InfoPresenter({
  container: containers.tripMain,
  pointsModel,
});

const boardPresenter = new BoardPresenter({
  mainContainer: containers.main,
  pointsModel,
  filtersModel,
  rerenderInfo: tripInfoPresenter.rerenderInfo,
});

const newPointButton = new NewPointButtonView();
newPointButton.setOpenEditorHandler(() => boardPresenter.handleCreatorOpen());

const filtersPresenter = new FiltersPresenter({
  container: containers.filters,
  pointsModel,
  filtersModel,
  onFilterChange: () => boardPresenter.handleFilterTypeChange(),
});

pointsModel.init().finally(() => {
  render(newPointButton, containers.tripMain, RenderPosition.BEFOREEND);
  boardPresenter.init();
  filtersPresenter.init();
  tripInfoPresenter.init();
});
