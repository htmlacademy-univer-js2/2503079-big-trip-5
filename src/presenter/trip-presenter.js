import { Sorts } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { sortByDate, sortByPrice, sortByTime } from '../utils/point.js';
import EmptyListView from '../view/empty-list-view.js';
import PointListView from '../view/points-list-view.js';
import TripInfoView from '../view/trip-view.js';
import FilterPresenter from './filter-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import PointPresenter from './point-presenter.js';
import SortPresenter from './sort-presenter.js';

export default class Presenter {
  #listComponent = new PointListView();
  #emptyListComponent = null;
  #tripInfoComponent = null;
  #sortPresenter = null;
  #newPointPresenter = null;

  #tripEventsContainer = null;
  #offersModel = null;
  #destinationsModel = null;
  #pointsModel = null;
  #filterModel = null;
  #filterPresenter = null;
  #pointPresenters = new Map();
  #currentSortType = Sorts.DAY;
  #addPointButton = null;

  constructor({
    tripEventsContainer,
    pointsModel,
    offersModel,
    destinationsModel,
    filterModel,
    addPointButton
  }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#addPointButton = addPointButton;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#addPointButton.addEventListener('click', this.#handleCreateNewPoint);
  }

  get points() {
    const points = this.#pointsModel.get();
    const filteredPoints = filter[this.#filterModel.filterType](points);
    const sortedPoints = [...filteredPoints];

    switch (this.#currentSortType) {
      case Sorts.TIME:
        return sortedPoints.sort(sortByTime);
      case Sorts.PRICE:
        return sortedPoints.sort(sortByPrice);
      case Sorts.DAY:
      default:
        return sortedPoints.sort(sortByDate);
    }
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(
      this.#destinationsModel,
      this.#offersModel,
      this.#listComponent,
      this.#handleViewAction,
      this.#handleModeChange
    );
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderTripInfo() {
    const tripInfoElement = document.querySelector('.trip-main');
    if (this.#tripInfoComponent) {
      remove(this.#tripInfoComponent);
    }
    this.#tripInfoComponent = new TripInfoView(
      this.points.map((point) => this.#destinationsModel.getById(point.destination)),
      this.points
    );
    render(this.#tripInfoComponent, tripInfoElement, RenderPosition.AFTERBEGIN);
  }

  #renderFilter = () => {
    if (this.#filterPresenter) {
      this.#filterPresenter.destroy();
    }
    this.#filterPresenter = new FilterPresenter({
      filterContainer: this.#tripEventsContainer,
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel
    });
    this.#filterPresenter.init();
  };

  #renderEmptyList = () => {
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }
    this.#emptyListComponent = new EmptyListView(this.#filterModel.filterType);
    render(this.#emptyListComponent, this.#tripEventsContainer);
  };

  #clearTrip = () => {
    this.#pointPresenters.forEach((presenter) => presenter.removeComponent());
    this.#pointPresenters.clear();

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
      this.#emptyListComponent = null;
    }

    if (this.#tripInfoComponent) {
      remove(this.#tripInfoComponent);
      this.#tripInfoComponent = null;
    }

    if (this.#sortPresenter) {
      this.#sortPresenter.destroy();
      this.#sortPresenter = null;
    }

    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
      this.#newPointPresenter = null;
    }
  };

  #renderSort() {
    if (this.#sortPresenter) {
      this.#sortPresenter.destroy();
    }
    this.#sortPresenter = new SortPresenter(
      this.#handleSortTypeChange,
      this.#tripEventsContainer
    );
    this.#sortPresenter.init();
  }

  #renderNewPoint() {
    this.#newPointPresenter = new NewPointPresenter({
      container: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      addPointButton: this.#addPointButton,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });
    this.#newPointPresenter.init();
    this.#addPointButton.disabled = true;
  }

  #renderTrip = () => {
    this.#clearTrip();
    this.#renderFilter();

    if (this.points.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderTripInfo();
    this.#renderSort();
    render(this.#listComponent, this.#tripEventsContainer);
    this.#renderAllPoints();
  };

  #renderAllPoints = () => {
    this.points.forEach((point) => this.#renderPoint(point));
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#renderTrip();
  };

  #handleViewAction = (actionType, updateType, updatedPoint) => {
    switch(actionType) {
      case 'UPDATE_TASK':
        this.#pointsModel.updatePoint(updateType, updatedPoint);
        break;
      case 'ADD_TASK':
        this.#pointsModel.addPoint(updateType, updatedPoint);
        break;
      case 'DELETE_TASK':
        this.#pointsModel.deletePoint(updateType, updatedPoint);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case 'PATCH':
        this.#pointPresenters.get(data.id).init(data);
        break;
      case 'MINOR':
      case 'MAJOR':
        this.#renderTrip();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleCreateNewPoint = (evt) => {
    evt.preventDefault();
    this.#renderNewPoint();
  };

  init() {
    this.#renderTrip();
  }
}
