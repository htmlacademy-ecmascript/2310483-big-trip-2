import OffersView from '../view/offers-view/offers-view.js';
import OffersOptionView from '../view/offers-view/offers-option-view.js';
import TripEventListView from '../view/trip-event-list-view/trip-event-list-view.js';
import TripEventItemView from '../view/trip-event-list-view/trip-event-item-view.js';
import DestinationView from '../view/destionation-view.js';
import ModalPointView from '../view/modal-point-view.js';
import FiltersView from '../view/filters/filters-view.js';
import FiltersOptionView from '../view/filters/filters-option-view.js';
import SortView from '../view/sort/sort-view.js';
import SortOptionView from '../view/sort/sort-option-view.js';
import { render } from '../render.js';
import { FiltersOptions, SortOptions } from '../api/constants.js';

export default class Presenter {
  filtersComponent = new FiltersView();
  sortComponent = new SortView();
  tripEventListComponent = new TripEventListView();
  offersComponent = new OffersView();

  constructor(containers, eventsPoints, modalPointModel) {
    this.filtersContainer = containers.filters;
    this.mainContainer = containers.main;
    this.eventPoints = eventsPoints;
    this.modalPointData = modalPointModel.getModalPointData();
    this.modalPointComponent = new ModalPointView(this.modalPointData);
  }

  init() {
    render(this.filtersComponent, this.filtersContainer);
    FiltersOptions.forEach((filter) => render(new FiltersOptionView(filter), this.filtersComponent.getElement()));
    render(this.sortComponent, this.mainContainer);
    SortOptions.forEach((sortOption) => render(new SortOptionView(sortOption), this.sortComponent.getElement()));
    render(this.tripEventListComponent, this.mainContainer);
    render(this.modalPointComponent, this.tripEventListComponent.getElement());
    if (this.modalPointData.offersList.length > 0) {
      render(this.offersComponent, this.modalPointComponent.getElement().querySelector('.event__details'));
      this.modalPointData.offersList.map((offer) => render(new OffersOptionView(offer), this.offersComponent.getElement().querySelector('.event__available-offers')));
    }
    render(new DestinationView(this.modalPointData.currentDestination), this.modalPointComponent.getElement().querySelector('.event__details'));
    /*render(new DestionationView(), this.addNewPointComponent.getElement().querySelector('.event__details'));*/
    this.eventPoints.forEach((point) => render(new TripEventItemView(point), this.tripEventListComponent.getElement()));
  }
}
