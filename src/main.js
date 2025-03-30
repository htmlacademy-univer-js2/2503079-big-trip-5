
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import PointsPresenter from './presenter/trip-presenter.js';
import MockService from './service/mock-service.js';
const bodyElement = document.querySelector('body');
const mainContainer = bodyElement.querySelector('.page-main');
const tripEventsContainer = mainContainer.querySelector('.trip-events');

const mockService = new MockService();
const pointsModel = new PointsModel(mockService);
const offersModel = new OffersModel(mockService);
const destinationsModel = new DestinationsModel(mockService);
const pointsPresenter = new PointsPresenter({
  tripEventsContainer,
  pointsModel,
  offersModel,
  destinationsModel
});


pointsPresenter.init();
