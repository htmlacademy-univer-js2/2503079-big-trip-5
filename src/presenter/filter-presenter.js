import { UpdateType } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';
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

  #renderFilter() {
    if (this.#filterComponent) {
      remove(this.#filterComponent);
    }

    this.#filterComponent = new FilterView({
      currentFilterType: this.#filterModel.filterType,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    render(this.#filterComponent, this.#filterContainer, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    remove(this.#filterComponent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
    this.#pointsModel.removeObserver(this.#handleModelEvent);
  }
}
