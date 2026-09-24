import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createNewPointButtonTemplate = ({isDisabled}) =>
  `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" ${isDisabled ? 'disabled' : ''}>New event</button>`;

export default class NewPointButtonView extends AbstractStatefulView {
  #editorOpenHandler = null;

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
    this.setCreatorOpenHandler(this.#editorOpenHandler);
  }

  setDisable = (isDisabled) => {
    this.updateElement({isDisabled});
  };

  setCreatorOpenHandler = (callback) => {
    this.#editorOpenHandler = callback;
    this.element.addEventListener('click', this.#editorOpenHandler);
  };
}
