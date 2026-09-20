import { SortCb } from '../../utils/functions.js';

export default class PointsModel {
  #points = null;
  #destinations = null;
  #offersData = null;
  #tripApiService = null;

  constructor(tripApiService) {
    this.#tripApiService = tripApiService;
  }

  async init() {
    try {
      const [points, destinations, offers] = await Promise.all([
        this.#tripApiService.getPoints(),
        this.#tripApiService.getDestinations(),
        this.#tripApiService.getOffers(),
      ]);

      this.#points = this.#adaptPoints(points);
      this.#destinations = this.#adaptDestinations(destinations);
      this.#offersData = this.#adaptOffers(offers);
    } catch (e) {
      this.#points = [];
      this.#destinations = [];
      this.#offersData = new Map();
    }
  }

  get points() {
    return this.#points;
  }

  #updatePointClient(updatedPoint) {
    const pointIndex = this.#points.findIndex((point) => point.id === updatedPoint.id);
    if (pointIndex === -1) {
      return;
    }
    this.#points[pointIndex] = updatedPoint;
    this.#points.sort(SortCb['sort-day']);
  }

  async updatePointServer(updatedPoint) {
    const response = await this.#tripApiService.updatePoint(
      this.#adaptPointToRequest(updatedPoint)
    );

    this.#updatePointClient(this.#adaptPoint(response));
  }

  addPoint(point) {
    this.#points = [
      ...this.#points,
      { ...point, id: `${this.#points.length}` },
    ].sort(SortCb['sort-day']);
  }

  deletePoint(pointId) {
    const pointIndex = this.#points.findIndex((point) => point.id === pointId);
    if (pointIndex === -1) {
      return;
    }

    this.#points = this.#points.filter((point) => point.id !== pointId);
  }

  get destinations() {
    return this.#destinations;
  }

  get offersData() {
    return this.#offersData;
  }

  #adaptPoints = (points) =>
    points.map(this.#adaptPoint);

  #adaptPoint = (point) => ({
    id: point['id'],
    basePrice: point['base_price'],
    dateFrom: point['date_from'],
    dateTo: point['date_to'],
    destinationId: point['destination'],
    isFavorite: point['is_favorite'],
    offersIds: point['offers'],
    type: point['type'],
  });

  #adaptPointToRequest = (point) => ({
    'id': point['id'],
    'base_price': point['basePrice'],
    'date_from': point['dateFrom'],
    'date_to': point['dateTo'],
    'destination': point['destinationId'],
    'is_favorite': point['isFavorite'],
    'offers': point['offersIds'],
    'type': point['type'],
  });

  #adaptDestinations = (destinations) =>
    destinations.map((destination) => ({
      id: destination['id'],
      name: destination['name'],
      description: destination['description'],
      pictures: destination['pictures'].map((picture) => ({
        src: picture['src'],
        description: picture['desctiption'],
      })),
    }));

  #adaptOffers = (data) => {
    const result = data.map((item) => ({
      type: item['type'],
      offers: item['offers'].map((offer) => this.#adaptOffer(offer)),
    }));
    return result;
  };

  #adaptOffer = (offer) => ({
    id: offer['id'],
    value: offer['title'],
    price: offer['price'],
  });
}
