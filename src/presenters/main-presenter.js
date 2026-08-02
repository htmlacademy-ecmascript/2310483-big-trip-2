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
  #pointsPresenters = new Map();

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
        {
          container: this.#eventListComponent.element,
          point,
          destinations: this.#pointEditorData.destinationsList,
          offersData: this.#pointEditorData.offersData,
          onDataUpdate: this.#handlePointChange
        }
      );
      pointPresenter.init();
      this.#pointsPresenters.set(point.id, pointPresenter);
    });
  }

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
