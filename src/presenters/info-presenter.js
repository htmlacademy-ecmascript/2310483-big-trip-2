import TripInfoView from '../view/trip-info-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { getSelectedOffersPrice } from '../utils/functions.js';

export default class InfoPresenter {
  #infoComponent = null;
  #container = null;
  #destinations = null;
  #offersData = null;
  #points = null;
  #pointsModel = null;

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#destinations = this.#pointsModel.destinations;
    this.#offersData = this.#pointsModel.offersData;
    this.#points = this.#pointsModel.points;

    this.rerenderInfo(this.#points);
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
