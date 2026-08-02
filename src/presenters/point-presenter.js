import EventItemView from '../view/event-list-view/event-item-view.js';
import PointEditorView from '../view/point-editor-view.js';
import { render, replace } from '../framework/render.js';


export default class PointPresenter {
  #container = null;
  #pointComponent = null;
  #destinations = null;
  #offersData = null;
  #point = null;
  #editorComponent = null;
  #onDataUpdate = null;
  #onModeChange = null;
  #isEditMode = false;

  constructor({container, point, destinations, offersData, onDataUpdate, onModeChange}) {
    this.#container = container;
    this.#point = point;
    this.#destinations = destinations;
    this.#offersData = offersData;
    this.#onDataUpdate = onDataUpdate;
    this.#onModeChange = onModeChange;
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
    this.#editorComponent.setDeleteClickHandler(this.#handleDelete);
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
    this.#replaceFormToPoint();
  };

  #handleSubmit = (evt) => {
    evt.preventDefault();
    this.#replaceFormToPoint();
  };

  #handleDelete = () => {
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

  update(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditorComponent = this.#editorComponent;

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

    replace(this.#pointComponent, prevPointComponent);

    this.#pointComponent.setRollupClickHandler(this.#handleEditOpen);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editorComponent.setRollupClickHandler(this.#handleEditClose);
    this.#editorComponent.setSubmitClickHandler(this.#handleSubmit);
    this.#editorComponent.setDeleteClickHandler(this.#handleDelete);
  }
}

/*
  1. блокировка фильтров
  2. пустая страница без точек (включая сортировку)
*/

