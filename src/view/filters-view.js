import AbstractView from '../framework/view/abstract-view.js';

const createFiltersTemplate = ({filters, points, currentFilter}) => `
  <form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => `<div class="trip-filters__filter">
      <input
        id="${filter.id}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filter.value}"
        ${filter.value === currentFilter ? 'checked' : ''}
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
  #handleFilterTypeChange = null;
  #currentFilter = null;

  constructor({filters, points, currentFilter, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#points = points;
    this.#currentFilter = currentFilter;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.querySelectorAll('.trip-filters__filter-input')
      .forEach((filter) => filter.addEventListener('change', this.#handleFilterTypeChange));
  }

  get template() {
    return createFiltersTemplate(
      {
        filters: this.#filters,
        points: this.#points,
        currentFilter: this.#currentFilter
      }
    );
  }
}
