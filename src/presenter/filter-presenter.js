import { UpdateType } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import FilterView from '../view/filter-view.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor({ filterContainer, filterModel, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#renderFilter();
  }

  #handleModelEvent = () => {
    this.#renderFilter();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filterType === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #getDisabledFilters() {
    const points = this.#pointsModel.points;
    if (!points || points.length === 0) {
      return ['future', 'present', 'past'];
    }

    const disabledFilters = [];
    Object.entries(filter).forEach(([filterType, filterFunction]) => {
      if (filterType !== 'everything' && filterFunction(points).length === 0) {
        disabledFilters.push(filterType);
      }
    });

    return disabledFilters;
  }

  #renderFilter() {
    if (this.#filterComponent) {
      remove(this.#filterComponent);
    }

    this.#filterComponent = new FilterView({
      currentFilterType: this.#filterModel.filterType,
      onFilterTypeChange: this.#handleFilterTypeChange,
      disabledFilters: this.#getDisabledFilters()
    });

    render(this.#filterComponent, this.#filterContainer, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    remove(this.#filterComponent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
    this.#pointsModel.removeObserver(this.#handleModelEvent);
  }
}
