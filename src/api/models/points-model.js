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

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offersData() {
    return this.#offersData;
  }

  async init() {
    const [points, destinations, offers] = await Promise.all([
      this.#tripApiService.getPoints(),
      this.#tripApiService.getDestinations(),
      this.#tripApiService.getOffers(),
    ]);

    this.#points = this.#adaptPoints(points);
    this.#destinations = this.#adaptDestinations(destinations);
    this.#offersData = this.#adaptOffers(offers);
  }

  #updatePointsClient(updatedPoint, action = UpdateActions.UPDATE) {
    const pointIndex = action === UpdateActions.UPDATE ? this.#points.findIndex((point) => point.id === updatedPoint.id) : null;
    switch (action) {
      case UpdateActions.DELETE:
        this.#points = this.#points.filter((point) => point.id !== updatedPoint.id);
        this.#points.sort(SortCb['sort-day']);
        break;
      case UpdateActions.UPDATE:
        this.#points[pointIndex] = updatedPoint;
        this.#points.sort(SortCb['sort-day']);
        break;
      case UpdateActions.CREATE:
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
    const pointData = this.#adaptPointToRequest(point);

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

  #adaptPointToRequest = (point) => {
    const result = {
      'id': point['id'],
      'base_price': point['basePrice'],
      'date_from': point['dateFrom'],
      'date_to': point['dateTo'],
      'destination': point['destinationId'],
      'is_favorite': point['isFavorite'],
      'offers': point['offersIds'],
      'type': point['type'],
    };

    if (point.id) {
      result['id'] = point['id'];
    }

    return result;
  };

  #adaptDestinations = (destinations) =>
    destinations.map((destination) => ({
      id: destination['id'],
      name: destination['name'],
      description: destination['description'],
      pictures: destination['pictures'].map((picture) => ({
        src: picture['src'],
        description: picture['description'],
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
