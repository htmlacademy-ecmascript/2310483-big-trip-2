import {createElement} from '../render.js';

const createSortTemplate = (sortOptions) => `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortOptions.map((sortOption) => `<div class="trip-sort__item  ${sortOption.class}">
          <input id="${sortOption.id}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${sortOption.value}">
          <label class="trip-sort__btn" for="${sortOption.id}">${sortOption.name}</label>
        </div>`).join('')}
    </form>
`;

export default class SortView {
  constructor(sortOptions) {
    this.sortOptions = sortOptions;
    this.element = null;
  }

  getTemplate() {
    return createSortTemplate(this.sortOptions);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
