import { SortCb } from '../../utils/functions.js';

const UpdateActions = {
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
  CREATE: 'CREATE',
};

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

  #updatePointsClient(updatedPoint, action = 'UPDATE') {
    const pointIndex = action === 'UPDATE' ? this.#points.findIndex((point) => point.id === updatedPoint.id) : null;
    switch (action) {
      case 'DELETE':
        this.#points = this.#points.filter((point) => point.id !== updatedPoint.id);
        this.#points.sort(SortCb['sort-day']);
        break;
      case 'UPDATE':
        this.#points[pointIndex] = updatedPoint;
        this.#points.sort(SortCb['sort-day']);
        break;
      case 'CREATE':
        this.#points = this.#points.concat(updatedPoint);
        this.#points.sort(SortCb['sort-day']);
        break;
    }
  }

  async updatePointServer(updatedPoint) {
    const response = await this.#tripApiService.updatePoint(
      this.#adaptPointToRequest(updatedPoint)
    );

    this.#updatePointsClient(this.#adaptPoint(response));
  }

  async createPoint(point) {
    const pointData = this.#adaptNewPointToRequest(point);

    const response = await this.#tripApiService.createPoint(
      pointData
    );

    this.#updatePointsClient(this.#adaptPoint(response), UpdateActions.CREATE);
  }

  async deletePoint(pointId) {
    const pointIndex = this.#points.findIndex((point) => point.id === pointId);
    if (pointIndex === -1) {
      return;
    }

    await this.#tripApiService.deletePoint(pointId);
    this.#updatePointsClient(this.#points[pointIndex], UpdateActions.DELETE);
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

  #adaptNewPointToRequest = (point) => ({
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
