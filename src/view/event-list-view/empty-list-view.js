import AbstractView from '../../framework/view/abstract-view.js';

const createEmptyListViewTemplate = (filterState) => {
  const createMessage = () => {
    switch (filterState) {
      case 'Everything':
        return 'Click New Event to create your first point';
      case 'Past':
        return 'There are no past events now';
      case 'Present':
        return 'There are no present events now';
      case 'Future':
        return 'There are no future events now';
      default:
        return 'Click New Event to create your first point';
    }
  };

  return `
    <div>
      <h2 class="visually-hidden">Trip events</h2>
      <p class="trip-events__msg">${createMessage()}</p>
    </div>
  `;
};

export default class EmptyListView extends AbstractView {
  #filterState = null;

  constructor(filterState) {
    super();
    this.#filterState = filterState;
  }

  get template() {
    return createEmptyListViewTemplate(this.#filterState);
  }
}
