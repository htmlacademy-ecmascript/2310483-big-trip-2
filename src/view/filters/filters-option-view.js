import {createElement} from '../../render.js';

const createFiltersOptionTemplate = (filter) => `
    <div class="trip-filters__filter">
      <input id="${filter.id}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.value}" checked>
      <label class="trip-filters__filter-label" for="${filter.id}">${filter.name}</label>
    </div>
`;

export default class FiltersOptionView {
  constructor(filter) {
    this.filter = filter;
    this.element = null;
  }

  getTemplate() {
    return createFiltersOptionTemplate(this.filter);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
