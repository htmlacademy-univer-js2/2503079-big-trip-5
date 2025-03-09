import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import PointsPresenter from './presenter/trip-presenter.js';
import {
  render,
  RenderPosition
} from './render.js';
import FiltersView from './view/filter-view.js';
import TripInfoView from './view/trip-view.js';
const tripMainContainer = document.querySelector('.trip-main');
const tripEventsContainer = document.querySelector('.trip-events');
const filtersContainer = tripMainContainer.querySelector('.trip-controls__filters');
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const pointsPresenter = new PointsPresenter({
  tripEventsContainer,
  pointsModel,
  offersModel,
  destinationsModel
});

render(new TripInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);
render(new FiltersView(), filtersContainer);

pointsPresenter.init();
