import {createElement} from '../../render.js';

const createSortTemplate = () => `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    </form>
`;

export default class SortView {
  getTemplate() {
    return createSortTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
