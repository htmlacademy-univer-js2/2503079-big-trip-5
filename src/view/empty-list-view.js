import { FilterMessages } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';


function createEmptyListTemplate (filter) {
  return (`<section class="trip-events">
  <h2 class="visually-hidden">Trip events</h2>
  <p class="trip-events__msg">${FilterMessages[filter]}</p>
</section>`);
}

export default class EmptyListView extends AbstractView {
  #filter = null;

  constructor(filter) {
    super();

    this.#filter = filter;
  }

  get template() {
    return createEmptyListTemplate(this.#filter);
  }
}
