import ApiService from './framework/api-service';
import { adaptToServer } from './utils/common';


export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'}).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'}).then(ApiService.parseResponse);
  }

  async updatePoint(update) {
    const adaptedPoint = adaptToServer(update);
    const response = await this._load({
      url: `points/${update.id}`,
      method: 'PUT',
      body: JSON.stringify(adaptedPoint),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async createPoint(point) {
    const adaptedPoint = adaptToServer(point, true);
    const response = await this._load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(adaptedPoint),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async deletePoint(pointId) {
    const response = await this._load({
      url: `points/${pointId}`,
      method: 'DELETE'
    });

    return response;
  }
}
