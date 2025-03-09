import DestinationsModel from './destinations-model.js';
import OffersModel from './offers-model.js';
import PointsModel from './points-model.js';

export default class Model {
  constructor() {
    this.pointsModel = new PointsModel();
    this.offersModel = new OffersModel();
    this.destinationsModel = new DestinationsModel();
  }

  getPoints() {
    return this.pointsModel.getPoints();
  }

  getOffers() {
    return this.offersModel.getOffers();
  }

  getDestinations() {
    return this.destinationsModel.getDestinations();
  }
}
