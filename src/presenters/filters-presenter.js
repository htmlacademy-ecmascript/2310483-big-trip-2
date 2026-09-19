import FiltersView from '../view/filters-view.js';
import {render} from '../framework/render.js';

export default class FiltersPresenter {
  #filtersContainer = null;
  #filtersComponent = null;
  #pointsModel = null;
  #filtersModel = null;
  #onFilterChange = null;

  constructor({container, pointsModel, filtersModel, onFilterChange}) {
    this.#pointsModel = pointsModel;
    this.#filtersContainer = container;
    this.#filtersModel = filtersModel;
    this.#onFilterChange = onFilterChange;
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

  setCurrentFilter(filter) {
    this.#filtersModel.setCurrentFilter(filter);
  }

  init() {
    this.#filtersComponent = new FiltersView({
      filters: this.filters,
      points: this.points,
      currentFilter: this.currentFilter,
      onFilterTypeChange: this.#onFilterTypeChange
    });
    render(this.#filtersComponent, this.#filtersContainer);
  }

  #onFilterTypeChange = (evt) => {
    evt.preventDefault();
    this.setCurrentFilter(evt.target.value);
    this.#onFilterChange?.();
  };
}
