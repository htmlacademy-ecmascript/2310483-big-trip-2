import AbstractView from '../framework/view/abstract-view.js';

const createNewPointButtonTemplate = () =>
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class NewPointButtonView extends AbstractView {
  #openEditorHandler = null;

  constructor() {
    super();
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  setOpenEditorHandler = (callback) => {
    this.#openEditorHandler = callback;
    this.element.addEventListener('click', this.#openEditorHandler);
  };
}
