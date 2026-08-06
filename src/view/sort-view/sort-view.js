import AbstractView from '../../framework/view/abstract-view.js';

const createSortTemplate = () => `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    </form>
`;

export default class SortView extends AbstractView {
  #sortOptions = null;


  constructor(sortOptions) {
    super();
    this.#sortOptions = sortOptions;
  }

  get template() {
    return createSortTemplate();
  }
}
