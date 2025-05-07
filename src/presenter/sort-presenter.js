import { Sorts } from '../const.js';
import { remove, render } from '../framework/render.js';
import SortView from '../view/sort-view.js';

export default class SortPresenter {
  #sortContainer = null;
  #currentSortType = null;
  #onSortTypeChange = null;
  #sortComponent = null;

  constructor(onSortTypeChange, sortContainer) {
    this.#sortContainer = sortContainer;
    this.#currentSortType = Sorts.DAY;
    this.#onSortTypeChange = onSortTypeChange;
  }

  init() {
    this.#renderSort();
  }

  destroy() {
    remove(this.#sortComponent);
    this.#sortComponent = null;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#onSortTypeChange(sortType);
  };

  #renderSort() {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    if (prevSortComponent === null) {
      render(this.#sortComponent, this.#sortContainer);
      return;
    }

    remove(prevSortComponent);
    render(this.#sortComponent, this.#sortContainer);
  }
}
