import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createNewPointButtonTemplate = ({isDisabled}) =>
  `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" ${isDisabled ? 'disabled' : ''}>New event</button>`;

export default class NewPointButtonView extends AbstractStatefulView {
  #handleEditorOpen = null;

  constructor() {
    super();

    this._state = {
      isDisabled: false
    };
  }

  get template() {
    return createNewPointButtonTemplate({isDisabled: this._state.isDisabled});
  }

  _restoreHandlers() {
    this.setOpenEditorHandler(this.#handleEditorOpen);
  }

  setDisable = (isDisabled) => {
    this.updateElement({isDisabled});
  };

  setOpenEditorHandler = (callback) => {
    this.#handleEditorOpen = callback;
    this.element.addEventListener('click', this.#handleEditorOpen);
  };
}
