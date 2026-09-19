import BoardPresenter from './presenters/board-presenter.js';
import FiltersPresenter from './presenters/filters-presenter.js';
import PointsModel from './api/models/points-model.js';
import FiltersModel from './api/models/filters-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { render, RenderPosition } from './framework/render.js';

const containers = {
  filters: document.querySelector('.trip-controls__filters'),
  main: document.querySelector('.trip-events'),
  tripMain: document.querySelector('.trip-main'),
};
const pointsModel = new PointsModel();
const filtersModel = new FiltersModel();

const boardPresenter = new BoardPresenter({
  mainContainer: containers.main,
  pointsModel,
  filtersModel,
});

const newPointButton = new NewPointButtonView();
newPointButton.setOpenEditorHandler(() => boardPresenter.handleCreatorOpen());

const filtersPresenter = new FiltersPresenter({
  container: containers.filters,
  pointsModel,
  filtersModel,
  onFilterChange: () => boardPresenter.handleFilterTypeChange(),
});

render(newPointButton, containers.tripMain, RenderPosition.BEFOREEND);
filtersPresenter.init();
boardPresenter.init();
