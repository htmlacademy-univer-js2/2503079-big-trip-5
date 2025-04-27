import { Sorts } from '../const.js';

import SortView from '../view/sort-view.js';

import { render } from '../framework/render.js';

export default class SortPresenter {
  #onSortComponentClick = null;
  #container = null;

  constructor(onSortComponentClick, container) {
    this.#onSortComponentClick = onSortComponentClick;
    this.#container = container;
  }

  #renderSort() {
    render(new SortView(Sorts, this.#onSortComponentClick), this.#container);
  }

  init() {
    this.#renderSort();
  }
}
