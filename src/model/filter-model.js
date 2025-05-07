import Observable from '../framework/observable.js';

export default class FilterModel extends Observable {
  #filterType = 'everything';

  get filterType() {
    return this.#filterType;
  }

  setFilter(updateType, filterType) {
    this.#filterType = filterType;
    this._notify(updateType, filterType);
  }
}
