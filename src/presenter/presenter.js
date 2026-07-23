import TripEventListView from '../view/trip-event-list-view/trip-event-list-view.js';
import TripEventItemView from '../view/trip-event-list-view/trip-event-item-view.js';
import ModalPointView from '../view/modal-point-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import { render } from '../framework/render.js';
import { FiltersOptions, SortOptions } from '../api/constants.js';

export default class Presenter {
  #tripEventListComponent = new TripEventListView();
  constructor(containers, eventsPoints, modalPointModel) {
    this.mainContainer = containers.main;
    this.filtersContainer = containers.filters;
    this.eventPoints = eventsPoints;
    this.modalPointData = modalPointModel.getModalPointData();
    this.modalPointComponent = new ModalPointView(this.modalPointData);
  }

  init() {
    render(new FiltersView(FiltersOptions), this.filtersContainer);
    render(new SortView(SortOptions), this.mainContainer);
    render(this.tripEventListComponent, this.mainContainer);
    render(this.modalPointComponent, this.#tripEventListComponent.element);
    this.eventPoints.forEach((point) => render(new TripEventItemView(point), this.#tripEventListComponent.element));
  }
}
