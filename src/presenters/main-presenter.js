import TripEventListView from '../view/trip-event-list-view/trip-event-list-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import { render } from '../framework/render.js';
import { FiltersOptions, SortOptions } from '../api/constants.js';
import PointPresenter from './point-presenter.js';

export default class MainPresenter {
  #tripEventListComponent = new TripEventListView();
  #mainContainer = null;
  #filtersContainer = null;
  #eventPoints = null;
  #pointEditorData = null;

  constructor(containers, eventsPoints, pointEditorModel) {
    this.#mainContainer = containers.main;
    this.#filtersContainer = containers.filters;
    this.#eventPoints = eventsPoints;
    this.#pointEditorData = pointEditorModel.data;
  }

  init() {
    render(new FiltersView(FiltersOptions), this.#filtersContainer);
    render(new SortView(SortOptions), this.#mainContainer);
    render(this.#tripEventListComponent, this.#mainContainer);
    this.#eventPoints.forEach((point) => {
      const pointPresenter = new PointPresenter(
        this.#tripEventListComponent.element,
        point,
        this.#pointEditorData.destinationsList,
        this.#pointEditorData.offersData
      );
      pointPresenter.init();
    });
  }
}

