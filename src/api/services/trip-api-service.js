import ApiService from '../../framework/api-service.js';

const Method = {
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const ApiPath = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};

export default class TripApiService extends ApiService {

  async getPoints() {
    const response = await this._load({
      url: ApiPath.POINTS,
    });

    return ApiService.parseResponse(response);
  }

  async getOffers() {
    const response = await this._load({
      url: ApiPath.OFFERS
    });

    return ApiService.parseResponse(response);
  }

  async getDestinations() {
    const response = await this._load({
      url: ApiPath.DESTINATIONS
    });

    return ApiService.parseResponse(response);
  }

  async updatePoint(point) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const response = await this._load({
      url: `${ApiPath.POINTS}/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(point),
      headers
    });

    return ApiService.parseResponse(response);
  }

  async deletePoint(pointId) {
    await this._load({
      url: `${ApiPath.POINTS}/${pointId}`,
      method: Method.DELETE
    });
  }

  async createPoint(point) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const response = await this._load({
      url: ApiPath.POINTS,
      method: Method.POST,
      body: JSON.stringify(point),
      headers
    });

    return ApiService.parseResponse(response);
  }
}
