import EventItemView from '../view/event-list-view/event-item-view.js';
import PointEditorView from '../view/editor-view.js';
import { render, replace, remove } from '../framework/render.js';


export default class PointPresenter {
  #container = null;
  #pointComponent = null;
  #destinations = null;
  #offersData = null;
  #point = null;
  #editorComponent = null;
  #dataUpdateHandler = null;
  #editorModeHandler = null;
  #pointDeleteHandler = null;
  #isEditMode = false;

  constructor({container, point, destinations, offersData, dataUpdateHandler, editorModeHandler, pointDeleteHandler}) {
    this.#container = container;
    this.#point = point;
    this.#destinations = destinations;
    this.#offersData = offersData;
    this.#dataUpdateHandler = dataUpdateHandler;
    this.#editorModeHandler = editorModeHandler;
    this.#pointDeleteHandler = pointDeleteHandler;
  }

  init() {
    this.#pointComponent = new EventItemView(
      {
        point: this.#point,
        destinations: this.#destinations,
        offers: this.#offersData.find((item) => item.type === this.#point.type).offers
      }
    );

    this.#editorComponent = new PointEditorView({
      point: this.#point,
      referenceData: {
        destinations: this.#destinations,
        offersData: this.#offersData
      }
    });
    render(this.#pointComponent, this.#container);

    this.#pointComponent.setRollupClickHandler(this.#editorOpenHandler);
    this.#pointComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#editorComponent.setRollupClickHandler(this.#editorCloseHandler);
    this.#editorComponent.setSubmitClickHandler(this.#submitHandler);
    this.#editorComponent.setResetClickHandler(this.#pointDeleteHandler);
  }

  destroy() {
    if (this.#isEditMode) {
      this.#replaceFormToPoint();
    }
    remove(this.#pointComponent);
    remove(this.#editorComponent);
  }

  update(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditorComponent = this.#editorComponent;
    const wasEditMode = this.#isEditMode;

    this.#pointComponent = new EventItemView(
      {
        point: this.#point,
        destinations: this.#destinations,
        offers: this.#offersData.find((item) => item.type === this.#point.type).offers
      }
    );

    this.#editorComponent = new PointEditorView({
      point: this.#point,
      referenceData: {
        destinations: this.#destinations,
        offersData: this.#offersData
      }
    });

    this.#pointComponent.setRollupClickHandler(this.#editorOpenHandler);
    this.#pointComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#editorComponent.setRollupClickHandler(this.#editorCloseHandler);
    this.#editorComponent.setSubmitClickHandler(this.#submitHandler);
    this.#editorComponent.setResetClickHandler(this.#pointDeleteHandler);

    if (wasEditMode) {
      replace(this.#editorComponent, prevEditorComponent);
      this.#replaceFormToPoint();
      return;
    }

    replace(this.#pointComponent, prevPointComponent);
  }

  resetMode() {
    if (this.#isEditMode) {
      this.#replaceFormToPoint();
    }
  }

  setIsSaving(isSaving) {
    this.#editorComponent.updateElement({isSaving, isDisabled: isSaving});
  }

  setIsDeleting(isDeleting) {
    this.#editorComponent.updateElement({isDeleting, isDisabled: isDeleting});
  }

  setAborting() {
    if (!this.#isEditMode) {
      this.#pointComponent.shake();
    }

    const resetFormState = () => this.#editorComponent.updateElement({
      isSaving: false,
      isDeleting: false,
      isDisabled: false
    });

    this.#editorComponent.shake(resetFormState);
  }

  #replacePointToForm() {
    replace(this.#editorComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#isEditMode = true;
  }

  #replaceFormToPoint() {
    this.#editorComponent.updateElement({
      point: {...this.#point},
    });
    replace(this.#pointComponent, this.#editorComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#isEditMode = false;
  }

  #editorOpenHandler = () => {
    this.#editorModeHandler();
    this.#replacePointToForm();
  };

  #editorCloseHandler = () => {
    this.#replaceFormToPoint();
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    const updatedData = {...this.#editorComponent.point};
    this.#editorComponent.updateElement(updatedData);
    this.#dataUpdateHandler(updatedData);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #favoriteClickHandler = () => {
    this.#dataUpdateHandler(
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      }
    );
  };
}
