import { Sorts } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createSortingTemplate() {
  let template = '';
  Object.values(Sorts).forEach((sort) => {
    template += `<div class="trip-sort__item  trip-sort__item--day">
    <input id="sort-${sort.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort.toLowerCase()}" ${sort === Sorts.DAY ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-${sort.toLowerCase()}">${sort.toLowerCase()}</label>
    </div>`;
  });

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
     ${template}
   </form>
   `;
}

export default class SortingView extends AbstractView {
  get template() {
    return createSortingTemplate();
  }
}
