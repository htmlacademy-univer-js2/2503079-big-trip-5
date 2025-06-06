import dayjs from 'dayjs';
import { DateFormat } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

import { getDuration } from '../utils/point.js';

const createFavoriteButtonTemplate = (isFavorite) => `
  <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </button>`;

const createOfferTemplate = (offers) => {
  if (!offers || offers.length === 0) {
    return '';
  }

  return offers.map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `).join('');
};

const createPointTemplate = (point, destination, offers) => `
  <li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${point.dateFrom}">${dayjs(point.dateFrom).format(DateFormat.SHORT)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${point.type} ${destination.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${point.dateFrom}">${dayjs(point.dateFrom).format(DateFormat.TIME)}</time>
        &mdash;
        <time class="event__end-time" datetime="${point.dateTo}">${dayjs(point.dateTo).format(DateFormat.TIME)}</time>
      </p>
      <p class="event__duration">${getDuration(point.dateFrom, point.dateTo)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${point.price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${createOfferTemplate(offers)}
    </ul>
      ${createFavoriteButtonTemplate(point.isFavorite)}
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
  </li>`;

export default class PointView extends AbstractView {
  #point = null;
  #pointDestination = null;
  #pointOffers = null;
  #onEditButtonClick = null;
  #onFavoriteButtonClick = null;

  constructor(point, pointDestination, pointOffers, onEditButtonClick, onFavoriteButtonClick) {
    super();
    this.#point = point;
    this.#pointDestination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#onEditButtonClick = onEditButtonClick;
    this.#onFavoriteButtonClick = onFavoriteButtonClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onEditButtonClick);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#onFavoriteButtonClick);
  }

  get template() {
    return createPointTemplate(this.#point, this.#pointDestination, this.#pointOffers);
  }
}
