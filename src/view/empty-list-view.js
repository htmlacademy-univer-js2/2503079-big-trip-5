import { FilterMessages } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createEmptyListTemplate(filterType, isLoading, isLoadingError) {
  if (isLoading) {
    return `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
      <p class="trip-events__msg">Loading...</p>
    </section>`;
  }

  if (isLoadingError) {
    return `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
      <p class="trip-events__msg">Failed to load latest route information</p>
    </section>`;
  }

  return `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>
    <p class="trip-events__msg">${FilterMessages[filterType]}</p>
  </section>`;
}

export default class EmptyListView extends AbstractView {
  #filterType = null;
  #isLoading = false;
  #isLoadingError = false;

  constructor({ currentFilterType, isLoading = false, isLoadingError = false }) {
    super();
    this.#filterType = currentFilterType;
    this.#isLoading = isLoading;
    this.#isLoadingError = isLoadingError;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType, this.#isLoading, this.#isLoadingError);
  }
}
