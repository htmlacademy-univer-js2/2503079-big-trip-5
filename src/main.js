import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import Presenter from './presenter/trip-presenter.js';
import MockService from './service/mock-service.js';

const bodyElement = document.querySelector('body');
const tripEventsContainer = bodyElement.querySelector('.trip-events');
const addPointButton = bodyElement.querySelector('.trip-main__event-add-btn');

const mockService = new MockService();
const pointsModel = new PointsModel(mockService);
const offersModel = new OffersModel(mockService);
const destinationsModel = new DestinationsModel(mockService);
const filterModel = new FilterModel();

const presenter = new Presenter({
  tripEventsContainer,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
  addPointButton
});

presenter.init();
