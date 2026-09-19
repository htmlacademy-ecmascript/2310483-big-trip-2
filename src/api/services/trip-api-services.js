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
}
