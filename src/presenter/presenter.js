import OffersView from '../view/offers-view/offers-view.js';
import OffersOptionView from '../view/offers-view/offers-option-view.js';
import TripEventListView from '../view/trip-event-list-view/trip-event-list-view.js';
import TripEventItemView from '../view/trip-event-list-view/trip-event-item-view.js';
import DestionationView from '../view/destionation-view.js';
import AddNewPointView from '../view/add-new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import FiltersView from '../view/filters/filters-view.js';
import FiltersOptionView from '../view/filters/filters-option-view.js';
import SortView from '../view/sort/sort-view.js';
import SortOptionView from '../view/sort/sort-option-view.js';
import { render } from '../render.js';
import { FiltersOptions, SortOptions } from '../api/constants.js';
import {offersOptions} from '../api/data.js';

export default class Presenter {
  filtersComponent = new FiltersView();
  sortComponent = new SortView();
  addNewPointComponent = new AddNewPointView();
  editPointComponent = new EditPointView();
  destionationComponent = new DestionationView();
  tripEventListComponent = new TripEventListView();
  constructor(containers) {
    this.filtersContainer = containers.filters;
    this.mainContainer = containers.main;
  }

  init() {
    render(this.filtersComponent, this.filtersContainer);
    FiltersOptions.forEach((filter) => render(new FiltersOptionView(filter), this.filtersComponent.getElement()));
    render(this.sortComponent, this.mainContainer);
    SortOptions.forEach((sortOption) => render(new SortOptionView(sortOption), this.sortComponent.getElement()));
    render(this.tripEventListComponent, this.mainContainer);
    render(this.editPointComponent, this.tripEventListComponent.getElement());
    render(new OffersView(), this.editPointComponent.getElement().querySelector('.event__details'));
    offersOptions.forEach((offerOptions) => render(new OffersOptionView(offerOptions), this.editPointComponent.getElement().querySelector('.event__available-offers')));
    render(new DestionationView(), this.editPointComponent.getElement().querySelector('.event__details'));
    render(this.addNewPointComponent, this.tripEventListComponent.getElement());
    render(new OffersView(), this.addNewPointComponent.getElement().querySelector('.event__details'));
    offersOptions.forEach((offerOptions) => render(new OffersOptionView(offerOptions), this.addNewPointComponent.getElement().querySelector('.event__available-offers')));
    render(new DestionationView(), this.addNewPointComponent.getElement().querySelector('.event__details'));
    for (let i = 0; i <= 3; i++) {
      render(new TripEventItemView(), this.tripEventListComponent.getElement());
    }
  }
}
