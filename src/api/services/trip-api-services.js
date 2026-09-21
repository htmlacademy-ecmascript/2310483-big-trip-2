import ApiService from '../../framework/api-service.js';

const METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const ApiPaths = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};

export default class TripApiServices extends ApiService {

  async getPoints() {
    const response = await this._load({
      url: ApiPaths.POINTS
    });

    return ApiService.parseResponse(response);
  }

  async getOffers() {
    const response = await this._load({
      url: ApiPaths.OFFERS
    });

    return ApiService.parseResponse(response);
  }

  async getDestinations() {
    const response = await this._load({
      url: ApiPaths.DESTINATIONS
    });

    return ApiService.parseResponse(response);
  }

  async updatePoint(point) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const response = await this._load({
      url: `${ApiPaths.POINTS}/${point.id}`,
      method: METHOD.PUT,
      body: JSON.stringify(point),
      headers
    });

    return ApiService.parseResponse(response);
  }

  async deletePoint(pointId) {
    await this._load({
      url: `${ApiPaths.POINTS}/${pointId}`,
      method: METHOD.DELETE
    });
  }

  async createPoint(point) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const response = await this._load({
      url: ApiPaths.POINTS,
      method: METHOD.POST,
      body: JSON.stringify(point),
      headers
    });

    return ApiService.parseResponse(response);
  }
}
