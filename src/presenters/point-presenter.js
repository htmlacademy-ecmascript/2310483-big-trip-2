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
  #onDataUpdate = null;
  #onModeChange = null;
  #onPointDelete = null;
  #isEditMode = false;

  constructor({container, point, destinations, offersData, onDataUpdate, onModeChange, onPointDelete}) {
    this.#container = container;
    this.#point = point;
    this.#destinations = destinations;
    this.#offersData = offersData;
    this.#onDataUpdate = onDataUpdate;
    this.#onModeChange = onModeChange;
    this.#onPointDelete = onPointDelete;
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

    this.#pointComponent.setRollupClickHandler(this.#handleEditOpen);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editorComponent.setRollupClickHandler(this.#handleEditClose);
    this.#editorComponent.setSubmitClickHandler(this.#handleSubmit);
    this.#editorComponent.setResetClickHandler(this.#handleDelete);
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

    this.#pointComponent.setRollupClickHandler(this.#handleEditOpen);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editorComponent.setRollupClickHandler(this.#handleEditClose);
    this.#editorComponent.setSubmitClickHandler(this.#handleSubmit);
    this.#editorComponent.setResetClickHandler(this.#handleDelete);

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

  #replacePointToForm() {
    replace(this.#editorComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#isEditMode = true;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editorComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#isEditMode = false;
  }

  #handleEditOpen = () => {
    this.#onModeChange();
    this.#replacePointToForm();
  };

  #handleEditClose = () => {
    this.#editorComponent.updateElement({
      point: {...this.#point},
      referenceData: {
        destinations: this.#destinations,
        offersData: this.#offersData
      }
    });
    this.#replaceFormToPoint();
  };

  #handleSubmit = (evt) => {
    evt.preventDefault();
    const updatedData = {...this.#editorComponent.state.point};
    this.#editorComponent.updateElement(updatedData);
    this.#onDataUpdate(updatedData);
  };

  #handleDelete = (id) => {
    this.#onPointDelete(id);
    this.#replaceFormToPoint();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleFavoriteClick = () => {
    this.#onDataUpdate(
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      }
    );
  };
}

/*
  1. блокировка фильтров
  2. пустая страница без точек (включая сортировку)
*/

