import AbstractView from '../../framework/view/abstract-view.js';

const createSortOptionTemplate = (sortOption) => `
  <div class="trip-sort__item  ${sortOption.class}">
    <input id="${sortOption.id}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="${sortOption.value}"
    >
    <label class="trip-sort__btn" for="${sortOption.id}">${sortOption.name}</label>
  </div>
`;

export default class SortOptionView extends AbstractView {
  #sortOption = null;
  #handlerSort = null;

  constructor(sortOption) {
    super();
    this.#sortOption = sortOption;
  }

  get template() {
    return createSortOptionTemplate(this.#sortOption);
  }

  setHandlerSort(callback) {
    this.#handlerSort = () => callback(this.#sortOption.value);
    this.element.querySelector('.trip-sort__input')
      .addEventListener('change', this.#handlerSort);
  }
}
