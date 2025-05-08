import ApiService from './framework/api-service';
import { adaptToServer } from './utils/common';


export default class PointsApiService extends ApiService {
  get points() {
    console.log('PointsApiService: Fetching points');
    return this._load({url: 'points'}).then(ApiService.parseResponse)
      .then((response) => {
        console.log('PointsApiService: Points response:', response);
        return response;
      });
  }

  get destinations() {
    console.log('PointsApiService: Fetching destinations');
    return this._load({url: 'destinations'}).then(ApiService.parseResponse)
      .then((response) => {
        console.log('PointsApiService: Destinations response:', response);
        return response;
      });
  }

  get offers() {
    console.log('PointsApiService: Fetching offers');
    return this._load({url: 'offers'}).then(ApiService.parseResponse)
      .then((response) => {
        console.log('PointsApiService: Offers response:', response);
        return response;
      });
  }

  async updatePoint(update) {
    const adaptedPoint = adaptToServer(update);
    console.log('Sending to server:', adaptedPoint);

    const response = await this._load({
      url: `points/${update.id}`,
      method: 'PUT',
      body: JSON.stringify(adaptedPoint),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }
}
