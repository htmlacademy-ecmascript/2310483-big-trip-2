import AbstractView from '../framework/view/abstract-view.js';

const createSortOptionTemplate = ({sortOption, currentSortType}) => `
  <div class="trip-sort__item  ${sortOption.class}">
    <input id="${sortOption.id}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="${sortOption.value}"
      ${sortOption.value === currentSortType ? 'checked' : ''}
      ${sortOption.disabled ? 'disabled' : ''}
    >
    <label class="trip-sort__btn" for="${sortOption.id}">${sortOption.name}</label>
  </div>
`;

const createSortTemplate = ({sortOptions, currentSortType}) => `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortOptions.map((sortOption) => createSortOptionTemplate({sortOption, currentSortType})).join('')}
    </form>
`;

export default class SortView extends AbstractView {
  #sortOptions = null;
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({sortOptions, onSortTypeChange, currentSortType}) {
    super();
    this.#sortOptions = sortOptions;
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;

    this.element.querySelectorAll('.trip-sort__input')
      .forEach((sortOption) => sortOption.addEventListener('change', this.#sortTypeChangeHandler));
  }

  get template() {
    return createSortTemplate({sortOptions: this.#sortOptions, currentSortType: this.#currentSortType});
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.value);
  };
}
