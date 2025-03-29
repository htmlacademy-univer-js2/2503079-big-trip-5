import PointsModel from './model/points-model.js';
import PointsPresenter from './presenter/trip-presenter.js';

const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripEventsContainerElement = document.querySelector('.trip-events');

new PointsPresenter({filtersContainer: filtersContainerElement, tripEventsContainer: tripEventsContainerElement,
  pointsModel: new PointsModel()}).init();
