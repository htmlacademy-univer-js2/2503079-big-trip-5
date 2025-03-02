import TripsPresenter from './presenter/trip-presenter.js';
import {
  render,
  RenderPosition
} from './render.js';
import FiltersView from './view/filter.js';
import TripInfoView from './view/trip.js';

const tripMainContainer = document.querySelector('.trip-main');
const tripEventsContainer = document.querySelector('.trip-events');
const filtersContainer = tripMainContainer.querySelector('.trip-controls__filters');
const pointsPresenter = new TripsPresenter({
  tripEventsContainer
});

render(new TripInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);
render(new FiltersView(), filtersContainer);

pointsPresenter.init();
