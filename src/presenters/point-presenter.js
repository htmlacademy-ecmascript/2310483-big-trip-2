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

  constructor({container, point, destinations, offersData, onDataUpdate}) {
    this.#container = container;
    this.#point = point;
    this.#destinations = destinations;
    this.#offersData = offersData;
    this.#onDataUpdate = onDataUpdate;
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

    this.#pointComponent.setRollupClickHandler(() => {
      replace(this.#editorComponent, this.#pointComponent);
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#editorComponent.setRollupClickHandler(() => {
      replace(this.#pointComponent, this.#editorComponent);
    });

    this.#editorComponent.setSubmitClickHandler(() => {
      replace(this.#pointComponent, this.#editorComponent);
    });

    this.#editorComponent.setDeleteClickHandler(() => {
      replace(this.#pointComponent, this.#editorComponent);
    });
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editorComponent);

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

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

    this.#pointComponent.setRollupClickHandler(() => {
      replace(this.#editorComponent, this.#pointComponent);
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#editorComponent.setRollupClickHandler(() => {
      replace(this.#pointComponent, this.#editorComponent);
    });

    this.#editorComponent.setSubmitClickHandler(() => {
      replace(this.#pointComponent, this.#editorComponent);
    });

    this.#editorComponent.setDeleteClickHandler(() => {
      replace(this.#pointComponent, this.#editorComponent);
    });

    replace(this.#pointComponent, prevPointComponent);
    replace(this.#editorComponent, prevEditorComponent);
  }
}

/*
  1. блокировка фильтров
  2. пустая страница без точек (включая сортировку)
*/

