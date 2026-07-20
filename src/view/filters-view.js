import { createElement } from '../render.js';

const filtersTemplate = (filters) => `
  <form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => `<div class="trip-filters__filter">
      <input id="${filter.id}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.value}" checked>
      <label class="trip-filters__filter-label" for="${filter.id}">${filter.name}</label>
    </div>`).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;

export default class FiltersView {
  constructor(filters) {
    this.filters = filters;
    this.element = null;
  }

  getTemplate() {
    return filtersTemplate(this.filters);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
