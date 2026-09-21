import TripInfoView from '../view/trip-info-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { getSelectedOffersPrice } from '../utils/functions.js';

export default class InfoPresenter {
  #infoComponent = null;
  #container = null;
  #destinations = null;
  #offersData = null;

  constructor({ container }) {
    this.#container = container;
  }

  init({destinations, offersData}) {
    this.#destinations = destinations;
    this.#offersData = offersData;
  }

  rerenderInfo = (points) => {
    if (this.#infoComponent !== null) {
      this.#clearInfo();
    }
    this.#renderInfo(points);
  };

  #clearInfo = () => {
    remove(this.#infoComponent);
    this.#infoComponent = null;
  };

  #renderInfo = (points) => {
    if (points.length === 0) {
      return;
    }
    const viewData = this.#collectDataForInfoBlock(points);
    this.#infoComponent = new TripInfoView(viewData);
    render(this.#infoComponent, this.#container, RenderPosition.AFTERBEGIN);
  };

  #collectDataForInfoBlock = (points) => {
    const destinationsIds = points.map((point) => point.destinationId);
    const cities = destinationsIds.map(
      (destinationId) =>
        this.#destinations.find(
          (destination) => destination.id === destinationId,
        ).name,
    );
    const offersPrice = getSelectedOffersPrice(points, this.#offersData);
    const totalPrice = points.reduce(
      (acc, point) => acc + point.basePrice,
      offersPrice,
    );
    const dates = {
      start: points[0].dateFrom,
      end: points[points.length - 1].dateTo,
    };

    return { cities, price: totalPrice, dates };
  };
}
