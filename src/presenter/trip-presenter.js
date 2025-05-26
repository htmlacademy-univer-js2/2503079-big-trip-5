import {FilterType, Sorts, UpdateType, UserAction} from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { sortPointDay, sortPointTime, sortPointPrice } from '../utils/point.js';
import TripEmptyView from '../view/empty-list-view.js';
import TripListView from '../view/points-list-view.js';
import TripInfoView from '../view/trip-view.js';
import FilterPresenter from './filter-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import PointPresenter from './point-presenter.js';
import SortingView from '../view/sort-view';

export default class Presenter {
  #listComponent = new TripListView();
  #emptyListComponent = null;
  #tripInfoComponent = null;
  #sortPresenter = null;
  #newPointPresenter = null;
  #pointPresenters = new Map();

  #containers;
  #offersModel;
  #destinationsModel;
  #pointsModel;
  #filterModel;
  #filterPresenter;
  #addPointButton;

  #currentSortType = Sorts.DAY;
  #isLoading = true;
  #isLoadingError = false;

  constructor({containers, pointsModel, offersModel, destinationsModel, filterModel, addPointButton}) {
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
    const all = this.#pointsModel.points;
    const filtered = filter[this.#filterModel.filterType](all);

    switch (this.#currentSortType) {
      case Sorts.DAY:
        return sortPointDay([...filtered]);
      case Sorts.TIME:
        return sortPointTime([...filtered]);
      case Sorts.PRICE:
        return sortPointPrice([...filtered]);
      default:
        return filtered;
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
      pointsModel: this.#pointsModel,
    });
    this.#filterPresenter.init();
  }

  #renderEmptyList({isLoading = false, isLoadingError = false} = {}) {
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }
    this.#emptyListComponent = new TripEmptyView({
      currentFilterType: this.#filterModel.filterType,
      isLoading,
      isLoadingError,
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
    render(
      this.#tripInfoComponent,
      this.#containers.tripInfoContainer,
      RenderPosition.AFTERBEGIN
    );
  }

  #renderSort() {
    if (this.#sortPresenter) {
      remove(this.#sortPresenter);
      this.#sortPresenter = null;
    }
    this.#sortPresenter = new SortingView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler,
    });
    render(this.#sortPresenter, this.#containers.eventContainer);
  }

  #renderList() {
    render(this.#listComponent, this.#containers.eventContainer);
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
    this.points.forEach((p) => this.#renderPoint(p));
  }

  #renderNewPoint() {
    this.#newPointPresenter = new NewPointPresenter({
      container: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      addPointButton: this.#addPointButton,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
    });
    this.#newPointPresenter.init();
    this.#addPointButton.disabled = true;
  }

  #clearTrip({resetSort = false} = {}) {
    // 1) Удаляем все точки
    this.#pointPresenters.forEach((p) => p.removeComponent());
    this.#pointPresenters.clear();

    // 2) Удаляем заглушки/трип-инфо/новую точку
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
      this.#emptyListComponent = null;
    }
    if (this.#tripInfoComponent) {
      remove(this.#tripInfoComponent);
      this.#tripInfoComponent = null;
    }
    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
      this.#newPointPresenter = null;
    }

    // 3) И очень важно — удаляем сам список, чтобы при новом рендере
    //    он заново создавался «с чистого листа»
    remove(this.#listComponent);

    // 4) Сброс сортировки при необходимости
    if (resetSort) {
      this.#currentSortType = Sorts.DAY;
    }
  }

  #renderTrip() {
    if (this.#isLoading) {
      this.#renderEmptyList({isLoading: true});
      return;
    }
    if (this.#isLoadingError) {
      this.#renderEmptyList({isLoadingError: true});
      return;
    }

    this.#renderFilter();

    if (this.points.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderTripInfo();
    this.#renderSort();
    this.#renderList();
    this.#renderAllPoints();
  }

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    // Полностью пересоздаём весь UI
    this.#clearTrip();
    this.#renderTrip();
  };

  #handleViewAction = async (actionType, updateType, data) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        await this.#pointsModel.updatePoint(updateType, data);
        break;
      case UserAction.ADD_POINT:
        await this.#pointsModel.addPoint(updateType, data);
        break;
      case UserAction.DELETE_POINT:
        await this.#pointsModel.deletePoint(updateType, data);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.INIT:
      case UpdateType.ERROR:
        this.#isLoading = false;
        this.#renderTrip();
        break;
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSort: true});
        this.#renderTrip();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((p) => p.resetView());
  };

  #handleCreateNewPoint = (evt) => {
    evt.preventDefault();

    // 1) reset the global filter to “Everything”
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    // 2) reset our sort to the default (by day)
    this.#currentSortType = Sorts.DAY;

    // 3) tear down + rebuild the trip UI with clean state
    this.#clearTrip({ resetSort: true });
    this.#renderTrip();

    // 4) now open the new-point form
    this.#renderNewPoint();
  };
}
