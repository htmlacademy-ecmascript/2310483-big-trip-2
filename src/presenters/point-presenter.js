import EventItemView from '../view/event-list-view/event-item-view.js';
import PointEditorView from '../view/point-editor-view.js';
import { render, replace } from '../framework/render.js';


export default class PointPresenter {
  #pointComponent = null;
  #editorComponent = null;

  constructor(container, point, destinations, offersData) {
    this.container = container;
    this.point = point;
    this.destinations = destinations;
    this.offersData = offersData;
  }

  init() {
    this.#pointComponent = new EventItemView(
      {
        point: this.point,
        destinations: this.destinations,
        offers: this.offersData.find((item) => item.type === this.point.type).offers
      }
    );

    this.#editorComponent = new PointEditorView({
      point: this.point,
      referenceData: {
        destinations: this.destinations,
        offersData: this.offersData
      }
    });
    render(this.#pointComponent, this.container);

    this.#pointComponent.setRollupClickHandler(() => {
      replace(this.#editorComponent, this.#pointComponent);
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });

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
}

/*
  1. блокировка фильтров
  2. пустая страница без точек (включая сортировку)
*/

