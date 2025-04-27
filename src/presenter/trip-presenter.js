import { FILTERS, Sorts } from '../const.js';
import { render, RenderPosition } from '../framework/render.js';
import { getRandomArrayElement, updateItem } from '../utils/common.js';
import { sort } from '../utils/sort.js';
import EmptyListView from '../view/empty-list-view.js';
import FilterView from '../view/filter-view.js';
import PointListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';
import TripInfoView from '../view/trip-view.js';
import PointPresenter from './point-presenter.js';
import SortPresenter from './sort-presenter.js';

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
  #pointPresenters = new Map();
  #currentSortType = Sorts.DAY;

  constructor({
    tripEventsContainer,
    pointsModel,
    offersModel,
    destinationsModel
  }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#tripPoints = sort[Sorts.DAY](pointsModel.points);
  }

  #renderPoint = () => {
    this.#tripPoints.forEach((point) => {
      const pointPresenter = new PointPresenter(this.#destinationsModel,
        this.#offersModel,
        this.#listComponent,
        this.#pointChangeHandler,
        this.#modeChangeHandler);
      pointPresenter.init(point);
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  };

  #renderTripInfo() {
    render(new TripInfoView(
      this.#tripPoints.map((point) => (
        this.#destinationsModel.getById(point.destination))),
      this.#tripPoints), tripInfoElement, RenderPosition.AFTERBEGIN);
  }

  #removePointPresenters() {
    this.#pointPresenters.forEach((point) => {
      point.removeComponent();
    });

    this.#pointPresenters = new Map();
  }

  #onSortComponentClick = (evt) => {
    if (this.#currentSortType !== evt.target.textContent) {
      this.#currentSortType = evt.target.textContent;

      sort[this.#currentSortType](this.#tripPoints);

      this.#removePointPresenters();
      this.#renderPoint();
    }
  };

  #renderSort() {
    const sortPresenter = new SortPresenter(
      this.#onSortComponentClick,
      this.#tripEventsContainer
    );

    sortPresenter.init();
  }


  #renderBoard() {
    const filter = getRandomArrayElement(FILTERS);

    render(new FilterView(filter), filterElement);

    if (this.#tripPoints.length) {
      this.#renderTripInfo();
      this.#renderSort();
      render(this.#listComponent, this.#tripEventsContainer);

      this.#renderPoint();

      return;
    }
    render(this.#listComponent, this.#tripEventsContainer);
    render(new EmptyListView(filter), this.#listComponent.element);
  }

  #pointChangeHandler = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((p) => p.resetView());
  };

  init() {
    this.#renderBoard();
  }
}
