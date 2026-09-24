import BoardPresenter from './presenters/board-presenter.js';
import FiltersPresenter from './presenters/filters-presenter.js';
import PointsModel from './api/models/points-model.js';
import FiltersModel from './api/models/filters-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { render, remove, RenderPosition } from './framework/render.js';
import TripApiService from './api/services/trip-api-service.js';
import InfoPresenter from './presenters/info-presenter.js';
import LoadingView from './view/loading-view.js';
import FailedLoadingView from './view/failed-loading-view.js';

const BASE_URL = 'https://22.objects.htmlacademy.pro/big-trip';

const authToken = `Basic ${self.crypto.randomUUID()}`;

const containers = {
  filters: document.querySelector('.trip-controls__filters'),
  main: document.querySelector('.trip-events'),
  tripMain: document.querySelector('.trip-main'),
};

const tripApiService = new TripApiService(BASE_URL, authToken);
const pointsModel = new PointsModel(tripApiService);
const filtersModel = new FiltersModel();
const tripInfoPresenter = new InfoPresenter({
  container: containers.tripMain,
});


const newPointButton = new NewPointButtonView();

const boardPresenter = new BoardPresenter({
  mainContainer: containers.main,
  pointsModel,
  filtersModel,
  rerenderInfo: tripInfoPresenter.rerenderInfo,
  newPointDisableHandler: newPointButton.setDisable,
});

newPointButton.setCreatorOpenHandler(() => boardPresenter.creatorOpenHandler());

const loadingComponent = new LoadingView();
const failedLoadingComponent = new FailedLoadingView();

const filtersPresenter = new FiltersPresenter({
  container: containers.filters,
  pointsModel,
  filtersModel,
  filterChangeHandler: () => boardPresenter.filterTypeChangeHandler(),
});

(async () => {
  try {
    render(loadingComponent, containers.main);

    await pointsModel.init();

    remove(loadingComponent);

    render(newPointButton, containers.tripMain, RenderPosition.BEFOREEND);
    boardPresenter.setfilterResetHandler(filtersPresenter.resetFilters);
    tripInfoPresenter.init({
      destinations: pointsModel.destinations,
      offersData: pointsModel.offersData,
    });

    boardPresenter.init();
    filtersPresenter.init();
  } catch {
    remove(loadingComponent);
    render(failedLoadingComponent, containers.main);
    newPointButton.setDisable(true);
    render(newPointButton, containers.tripMain, RenderPosition.BEFOREEND);

    filtersPresenter.init();
  }
})();
