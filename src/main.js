import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import PointsApiService from './points-api-service';
import Presenter from './presenter/trip-presenter.js';

const AUTHORIZATION = 'Basic ahsfsdfsdfs43242';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const bodyElement = document.querySelector('body');
const containers = {
  eventContainer: bodyElement.querySelector('.trip-events'),
  filterContainer: bodyElement.querySelector('.trip-controls__filters'),
  tripInfoContainer: bodyElement.querySelector('.trip-main')
};
const addPointButton = bodyElement.querySelector('.trip-main__event-add-btn');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const offersModel = new OffersModel(pointsApiService);
const destinationsModel = new DestinationsModel(pointsApiService);
const pointsModel = new PointsModel({pointsApiService, destinationsModel, offersModel});
const filterModel = new FilterModel();

const presenter = new Presenter({
  containers,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
  addPointButton
});

destinationsModel.init()
  .then(() => offersModel.init())
  .then(() => pointsModel.init())
  .then(() => {
    presenter.init();
  })
  .catch(() => {
  });
