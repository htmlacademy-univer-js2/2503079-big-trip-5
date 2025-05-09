import { FILTERS } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

export default class FilterView extends AbstractView {
  #currentFilterType = null;
  #onFilterTypeChange = null;
  #disabledFilters = null;

  constructor({ currentFilterType, onFilterTypeChange, disabledFilters }) {
    super();
    this.#currentFilterType = currentFilterType;
    this.#onFilterTypeChange = onFilterTypeChange;
    this.#disabledFilters = disabledFilters;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return this.#createFilterTemplate();
  }

  #createFilterTemplate() {
    return `
      <form class="trip-filters" action="#" method="get">
        ${FILTERS.map((filter) => `
          <div class="trip-filters__filter">
            <input id="filter-${filter.type}"
              class="trip-filters__filter-input visually-hidden"
              type="radio"
              name="trip-filter"
              value="${filter.type}"
              ${this.#currentFilterType === filter.type ? 'checked' : ''}
              ${this.#disabledFilters.includes(filter.type) ? 'disabled' : ''}>
            <label class="trip-filters__filter-label ${this.#disabledFilters.includes(filter.type) ? 'trip-filters__filter-label--disabled' : ''}"
              for="filter-${filter.type}">${filter.name}</label>
          </div>
        `).join('')}
      </form>
    `;
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName === 'INPUT' && !evt.target.disabled) {
      this.#onFilterTypeChange(evt.target.value);
    }
  };
}
