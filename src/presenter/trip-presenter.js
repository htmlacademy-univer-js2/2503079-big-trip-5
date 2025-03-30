import { FILTERS } from '../const.js';
import { render, RenderPosition, replace } from '../framework/render.js';
import { getRandomArrayElement } from '../utils/common.js';
import EditPointView from '../view/edit-point-view.js';
import EmptyListView from '../view/empty-list-view.js';
import FilterView from '../view/filter-view.js';
import PointView from '../view/point-view.js';
import PointListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';
import TripInfoView from '../view/trip-view.js';

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');
const filterElement = tripInfoElement.querySelector('.trip-controls__filters');

export default class Presenter {
  #listComponent = new PointListView();
  #sortingComponent = new SortView();

  #tripEventsContainer = null;
  #offersModel = null;
  #destinationsModel = null;
  #tripPoints = null;

  constructor({
    tripEventsContainer,
    pointsModel,
    offersModel,
    destinationsModel
  }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#tripPoints = pointsModel.points;
  }

  #renderPoint = (point, destination, offers) => {
    const pointComponent = new PointView(
      point,
      destination,
      offers,
      onRollupButtonClick);

    const pointEditComponent = new EditPointView(point,
      destination,
      offers,
      onResetButtonClick,
      onSaveButtonSubmit);

    const removeHandlerOnEscape = () => document.removeEventListener('keydown', onEscapeKeyDown);

    function onSaveButtonSubmit(evt) {
      evt.preventDefault();
      replace(pointComponent, pointEditComponent);
      removeHandlerOnEscape();
    }

    function onEscapeKeyDown(evt) {
      if (evt.key === 'Escape') {
        replace(pointComponent, pointEditComponent);
        removeHandlerOnEscape();
      }
    }

    function onRollupButtonClick() {
      replace(pointEditComponent, pointComponent);
      document.addEventListener('keydown', onEscapeKeyDown);
    }

    function onResetButtonClick() {
      replace(pointComponent, pointEditComponent);
      removeHandlerOnEscape();
    }

    render(pointComponent, this.#listComponent.element);
  };

  init() {
    const filter = getRandomArrayElement(FILTERS);

    render(new FilterView(filter), filterElement);

    if (this.#tripPoints.length) {
      render(new TripInfoView(
        this.#tripPoints.map((point) => (
          this.#destinationsModel.getById(point.destination))),
        this.#tripPoints), tripInfoElement, RenderPosition.AFTERBEGIN);

      render(this.#sortingComponent, this.#tripEventsContainer);
      render(this.#listComponent , this.#tripEventsContainer);

      for (let i = 0; i < this.#tripPoints.length; i++) {
        this.#renderPoint(
          this.#tripPoints[i],
          this.#destinationsModel.getById(this.#tripPoints[i].destination),
          this.#offersModel.getByType(this.#tripPoints[i].eventType));
      }
    } else {
      render(this.#listComponent , this.#tripEventsContainer);
      render(new EmptyListView(filter), this.#listComponent.element);
    }
  }
}
