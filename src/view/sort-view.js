import { Sorts } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createSortingTemplate(currentSortType) {
  let template = '';
  Object.values(Sorts).forEach((sort) => {
    template += `<div class="trip-sort__item  trip-sort__item--${sort}">
    <input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${sort}" ${sort === currentSortType ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-${sort}">${sort}</label>
    </div>`;
  });

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
     ${template}
   </form>
   `;
}

export default class SortingView extends AbstractView {
  #currentSortType = null;
  #onSortTypeChange = null;

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#currentSortType = currentSortType;
    this.#onSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortingTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    const sortType = evt.target.value;
    this.#onSortTypeChange(sortType);
  };
}
