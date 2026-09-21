import AbstractView from '../framework/view/abstract-view.js';

const createNewPointButtonTemplate = () =>
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class NewPointButtonView extends AbstractView {

  get template() {
    return createNewPointButtonTemplate();
  }

  setOpenEditorHandler = (callback) => {
    this.element.addEventListener('click', callback);
  };
}
