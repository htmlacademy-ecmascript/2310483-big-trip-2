import EventListView from '../view/event-list-view/event-list-view.js';
import EmptyListView from '../view/event-list-view/empty-list-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view/sort-view.js';
import SortOptionView from '../view/sort-view/sort-option-view.js';
import { render } from '../framework/render.js';
import { FiltersOptions, SortOptions, DEFAULT_SORT_OPTION } from '../api/constants.js';
import PointPresenter from './point-presenter.js';
import DateServices from '../api/services/date-services.js';

export default class MainPresenter {
  #destinations = [];
  #offersData = [];
  #points = [];
  #sourcedPoints = [];
  #mainContainer = null;
  #filtersContainer = null;
  #dateServices = new DateServices();

  #eventListComponent = new EventListView();
  #emptyListComponent = new EmptyListView();
  #sortContainer = new SortView(SortOptions);

  #pointsPresenters = new Map();
  #choosenSortOption = DEFAULT_SORT_OPTION;

  constructor({containers, points, destinations, offersData}) {
    this.#mainContainer = containers.main;
    this.#filtersContainer = containers.filters;

    this.#sourcedPoints = points;
    this.#points = points;
    this.#destinations = destinations;
    this.#offersData = offersData;
  }

  init() {
    this.#renderFilters();
    this.#renderPointsBoard();
  }

  #renderFilters() {
    render(new FiltersView(FiltersOptions, this.#points), this.#filtersContainer);
  }

  #renderPointsBoard() {
    render(this.#eventListComponent, this.#mainContainer);
    if(this.#points.length === 0) {
      this.#renderEmptyList();
      return;
    }
    this.#renderSort();
    this.#renderPoints();
  }

  #renderSort() {
    render(this.#sortContainer, this.#eventListComponent.element);
    SortOptions.forEach((option) => {
      const sortOptionComponent = new SortOptionView(option);
      render(sortOptionComponent, this.#sortContainer.element);
      sortOptionComponent.setHandlerSort(this.#handleSortPoints);
    });
  }

  #renderEmptyList() {
    render(this.#emptyListComponent, this.#mainContainer);
  }

  #renderPoints() {
    this.#sortPoints(this.#choosenSortOption);
    this.#points.forEach((point) => {
      const pointPresenter = new PointPresenter(
        {
          container: this.#eventListComponent.element,
          point,
          destinations: this.#destinations,
          offersData: this.#offersData,
          onDataUpdate: this.#handlePointChange,
          onModeChange: this.#handleEditorMode
        }
      );
      pointPresenter.init();
      this.#pointsPresenters.set(point.id, pointPresenter);
    });
  }

  #clearPoints() {
    this.#pointsPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointsPresenters.clear();
  }

  #sortPoints = (sortType) => {
    switch (sortType) {
      case 'sort-day':
        this.#points.sort((a, b) => a.dateFrom.getTime() - b.dateFrom.getTime());
        break;
      case 'sort-time':
        this.#points.sort((a, b) => this.#dateServices.getDurationInMilliseconds(b.dateFrom, b.dateTo) - this.#dateServices.getDurationInMilliseconds(a.dateFrom, a.dateTo));
        break;
      case 'sort-price':
        this.#points.sort((a, b) => b.basePrice - a.basePrice);
        break;
      default:
        this.#points = [...this.#sourcedPoints];
    }
  };

  #handleSortPoints = (sortType) => {
    if (this.#choosenSortOption === sortType) {
      return;
    }

    this.#choosenSortOption = sortType;
    this.#clearPoints();
    this.#renderPoints();
  };

  #handleEditorMode = () => {
    this.#pointsPresenters.forEach((pointPresenter) => {
      pointPresenter.resetMode();
    });
  };

  #handlePointChange = (updatedPoint) => {
    const pointIndex = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (pointIndex === -1) {
      return;
    }

    this.#points[pointIndex] = updatedPoint;

    const pointPresenter = this.#pointsPresenters.get(updatedPoint.id);

    if (pointPresenter) {
      pointPresenter.update(updatedPoint);
    }
  };
}
