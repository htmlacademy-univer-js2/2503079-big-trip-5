import { Sorts, UpdateType } from '../const.js';
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

const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

export default class Presenter {
  #listComponent = new PointListView();
  #emptyListComponent = null;
  #tripInfoComponent = null;
  #sortPresenter = null;
  #newPointPresenter = null;
  #pointPresenters = new Map();

  #containers = null;
  #offersModel = null;
  #destinationsModel = null;
  #pointsModel = null;
  #filterModel = null;
  #filterPresenter = null;
  #addPointButton = null;

  #currentSortType = Sorts.DAY;
  #isLoading = true;
  #isLoadingError = false;

  constructor({
    containers,
    pointsModel,
    offersModel,
    destinationsModel,
    filterModel,
    addPointButton
  }) {
    this.#containers = containers;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#addPointButton = addPointButton;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#addPointButton.addEventListener('click', this.#handleCreateNewPoint);
  }

  get points() {
    const allPoints = this.#pointsModel.points;
    if (!allPoints) {
      return [];
    }
    const filtered = filter[this.#filterModel.filterType](allPoints);
    const sorted = [...filtered];

    switch (this.#currentSortType) {
      case Sorts.TIME:
        return sorted.sort(sortByTime);
      case Sorts.PRICE:
        return sorted.sort(sortByPrice);
      case Sorts.DAY:
      default:
        return sorted.sort(sortByDate);
    }
  }

  init() {
    this.#renderTrip();
  }

  #renderFilter() {
    if (this.#filterPresenter) {
      this.#filterPresenter.destroy();
    }
    this.#filterPresenter = new FilterPresenter({
      filterContainer: this.#containers.filterContainer,
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel
    });
    this.#filterPresenter.init();
  }

  #renderEmptyList({ isLoading = false, isLoadingError = false } = {}) {
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }
    this.#emptyListComponent = new EmptyListView({
      currentFilterType: this.#filterModel.filterType,
      isLoading,
      isLoadingError
    });
    render(this.#emptyListComponent, this.#containers.eventContainer);
  }

  #renderTripInfo() {
    if (this.#tripInfoComponent) {
      remove(this.#tripInfoComponent);
    }
    this.#tripInfoComponent = new TripInfoView(
      this.points,
      this.#destinationsModel.destinations,
      this.#offersModel.offers
    );
    render(this.#tripInfoComponent, this.#containers.tripInfoContainer, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    if (this.#sortPresenter) {
      this.#sortPresenter.destroy();
    }
    this.#sortPresenter = new SortPresenter(this.#handleSortTypeChange, this.#containers.eventContainer);
    this.#sortPresenter.init(this.#currentSortType);
  }

  #renderPoint(point) {
    const presenter = new PointPresenter(
      this.#destinationsModel,
      this.#offersModel,
      this.#listComponent,
      this.#handleViewAction,
      this.#handleModeChange
    );
    presenter.init(point);
    this.#pointPresenters.set(point.id, presenter);
  }

  #renderAllPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
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

  #clearTrip({ resetSort = false } = {}) {
    this.#pointPresenters.forEach((p) => p.removeComponent());
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
    if (resetSort) {
      this.#currentSortType = Sorts.DAY;
    }
  }

  #renderTrip() {
    this.#clearTrip();
    this.#renderFilter();

    if (this.#isLoading) {
      this.#renderEmptyList({ isLoading: true });
      return;
    }

    if (this.#isLoadingError) {
      this.#renderEmptyList({ isLoadingError: true });
      return;
    }

    if (!this.points || this.points.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderTripInfo();
    this.#renderSort();
    render(this.#listComponent, this.#containers.eventContainer);
    this.#renderAllPoints();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#renderTrip();
  };

  #handleViewAction = (actionType, updateType, payload) => {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointsModel.updatePoint(updateType, payload);
        break;
      case UserAction.ADD_TASK:
        this.#pointsModel.addPoint(updateType, payload);
        break;
      case UserAction.DELETE_TASK:
        this.#pointsModel.deletePoint(updateType, payload);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#isLoadingError = data.isError;
        this.#renderTrip();
        break;
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({ resetSort: true });
        this.#renderTrip();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((p) => p.resetView());
  };

  #handleCreateNewPoint = (evt) => {
    evt.preventDefault();
    this.#renderNewPoint();
  };
}
