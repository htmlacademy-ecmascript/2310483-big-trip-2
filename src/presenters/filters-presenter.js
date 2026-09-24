import FiltersView from '../view/filters-view.js';
import { render, remove } from '../framework/render.js';

export default class FiltersPresenter {
  #filtersContainer = null;
  #filtersComponent = null;
  #pointsModel = null;
  #filtersModel = null;
  #filterChangeHandler = null;

  constructor({ container, pointsModel, filtersModel, filterChangeHandler }) {
    this.#pointsModel = pointsModel;
    this.#filtersContainer = container;
    this.#filtersModel = filtersModel;
    this.#filterChangeHandler = filterChangeHandler;
  }

  get filters() {
    return this.#filtersModel.filters;
  }

  get currentFilter() {
    return this.#filtersModel.currentFilter;
  }

  get points() {
    return this.#pointsModel.points;
  }

  #setCurrentFilter(filter) {
    this.#filtersModel.setCurrentFilter(filter);
  }

  resetFilters = () => {
    if (this.#filtersComponent === null) {
      return;
    }
    remove(this.#filtersComponent);
    this.#filtersComponent = null;
    this.init();
  };

  init() {
    this.#filtersComponent = new FiltersView({
      filters: this.filters,
      points: this.points,
      currentFilter: this.currentFilter,
      filterTypeChangeHandler: this.#filterTypeChangeHandler,
    });
    render(this.#filtersComponent, this.#filtersContainer);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#setCurrentFilter(evt.target.value);
    this.#filterChangeHandler?.();
  };
}
