import { FilterType } from '../const.js';
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
    return this.#createFilterTemplate(this.#currentFilterType);
  }

  #createFilterTemplate(currentFilterType) {
    return `
      <form class="trip-filters" action="#" method="get">
      ${Object.values(FilterType).reduce((acc, filterType) => (`${acc}<div class="trip-filters__filter">
        <input id="filter-${filterType}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
          value="${filterType}" ${currentFilterType === filterType ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${filterType}">${filterType[0].toUpperCase() + filterType.slice(1)}</label>
      </div>`), '')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
    `;
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onFilterTypeChange(evt.target.value);
  };
}
