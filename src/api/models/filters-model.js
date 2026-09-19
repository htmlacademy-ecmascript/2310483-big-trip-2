import {FiltersOptions, DEFAULT_FILTER} from '../constants';

export default class FiltersModel {
  #currentFilter = DEFAULT_FILTER;
  #filters = FiltersOptions;
  get filters() {
    return this.#filters;
  }

  get currentFilter() {
    return this.#currentFilter;
  }

  setCurrentFilter(filter) {
    this.#currentFilter = filter;
  }
}
