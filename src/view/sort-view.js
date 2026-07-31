import AbstractView from '../framework/view/abstract-view.js';

const createSortTemplate = (sortOptions) => `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortOptions.map((sortOption) => `<div class="trip-sort__item  ${sortOption.class}">
          <input id="${sortOption.id}"
            class="trip-sort__input  visually-hidden"
            type="radio"
            name="trip-sort"
            value="${sortOption.value}"
            ${sortOption.value === 'sort-day' ? 'checked' : ''}
          >
          <label class="trip-sort__btn" for="${sortOption.id}">${sortOption.name}</label>
        </div>`).join('')}
    </form>
`;

export default class SortView extends AbstractView {
  #sortOptions = null;
  constructor(sortOptions) {
    super();
    this.#sortOptions = sortOptions;
  }

  get template() {
    return createSortTemplate(this.#sortOptions);
  }
}
