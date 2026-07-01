import { createElement } from '../../render.js';

const filtersTemplate = () => `
  <form class="trip-filters" action="#" method="get">

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;

export default class FiltersView {
  getTemplate() {
    return filtersTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
