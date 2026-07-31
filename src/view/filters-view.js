import AbstractView from '../framework/view/abstract-view.js';

const createFiltersTemplate = (filters, points) => `
  <form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => `<div class="trip-filters__filter">
      <input
        id="${filter.id}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filter.value}"
        ${filter.value === 'everything' ? 'checked' : ''}
        ${!points ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="${filter.id}">${filter.name}</label>
    </div>`).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;

export default class FiltersView extends AbstractView {
  #filters = null;
  #points = null;
  constructor(filters, points) {
    super();
    this.#filters = filters;
    this.#points = points;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#points);
  }
}
