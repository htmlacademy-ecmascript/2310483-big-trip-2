import EventListView from '../view/event-list-view/event-list-view.js';
import EmptyListView from '../view/event-list-view/empty-list-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import { render } from '../framework/render.js';
import { FiltersOptions, SortOptions } from '../api/constants.js';
import PointPresenter from './point-presenter.js';

export default class MainPresenter {
  #eventListComponent = new EventListView();
  #mainContainer = null;
  #filtersContainer = null;
  #points = null;
  #pointEditorData = null;
  #emptyListComponent = new EmptyListView();

  constructor({containers, points, pointEditorModel}) {
    this.#mainContainer = containers.main;
    this.#filtersContainer = containers.filters;
    this.#points = points;
    this.#pointEditorData = pointEditorModel.data;
  }

  init() {
    render(new FiltersView(FiltersOptions, this.#points), this.#filtersContainer);
    render(new SortView(SortOptions), this.#mainContainer);
    render(this.#eventListComponent, this.#mainContainer);
    this.#points.forEach((point) => {
      const pointPresenter = new PointPresenter(
        this.#eventListComponent.element,
        point,
        this.#pointEditorData.destinationsList,
        this.#pointEditorData.offersData
      );
      pointPresenter.init();
    });
  }
}
