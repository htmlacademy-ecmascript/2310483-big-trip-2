import ApiService from '../../framework/api-service.js';

const METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};


export default class TripApiServices extends ApiService {
  constructor(endPoint, authorization) {
    super(endPoint, authorization);
  }

  async getPoints() {
    const response = await this._load({
      url: 'points'
    });

    return ApiService.parseResponse(response);
  }

  async getOffers() {
    const response = await this._load({
      url: 'offers'
    });

    return ApiService.parseResponse(response);
  }

  async getDestinations() {
    const response = await this._load({
      url: 'destinations'
    });

    return ApiService.parseResponse(response);
  }

  async updatePoint(point) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const response = await this._load({
      url: `points/${point.id}`,
      method: METHOD.PUT,
      body: JSON.stringify(point),
      headers
    });

    return ApiService.parseResponse(response);
  }

  async deletePoint(pointId) {
    const response = await this._load({
      url: `points/${pointId}`,
      method: METHOD.DELETE
    });

    return ApiService.parseResponse(response);
  }

  async createPoint(point) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const response = await this._load({
      url: 'points',
      method: METHOD.POST,
      body: JSON.stringify(point),
      headers
    });

    return ApiService.parseResponse(response);
  }
}
