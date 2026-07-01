import {createElement} from '../../render.js';

const createSortOptionTemplate = (sortOption) => `
    <div class="trip-sort__item  ${sortOption.class}">
      <input id="${sortOption.id}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${sortOption.value}">
      <label class="trip-sort__btn" for="${sortOption.id}">${sortOption.name}</label>
    </div>
`;

export default class SortOptionView {
  constructor(sortOption) {
    this.sortOption = sortOption;
    this.element = null;
  }

  getTemplate() {
    return createSortOptionTemplate(this.sortOption);
  }


  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
