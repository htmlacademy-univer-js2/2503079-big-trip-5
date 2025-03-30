import { CITIES, TYPE_POINTS } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createPicturesTemplate (pictures){
  let result = '';

  for (let i = 0; i < pictures.length; i++) {
    result += `<img class="event__photo" src=${pictures[i].src} alt="Event photo">`;
  }

  return result;
}

function createEventTypeTemplate (){
  let result = '';
  let typeL = '';

  for (let i = 0; i < TYPE_POINTS.length; i++) {
    typeL = TYPE_POINTS[i].toLowerCase();
    result += `<div class="event__type-item">
    <input id="event-type-${typeL}-${i + 1}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeL}">
    <label class="event__type-label  event__type-label--${typeL}" for="event-type-${typeL}-${i + 1}">${TYPE_POINTS[i]}</label>
  </div>`;
  }

  return result;
}

function createDestinationList () {
  let result = '';

  for (let i = 0; i < CITIES.length; i++) {
    result += `<option value="${CITIES[i].name}"></option>`;
  }

  return result;
}

function createOffersTemplate (offers) {
  let result = '';

  for (let i = 0; i < offers.length; i++) {
    result += `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${i + 1}" type="checkbox" name="event-offer-luggage" checked>
    <label class="event__offer-label" for="event-offer-luggage-${i + 1}">
      <span class="event__offer-title">${offers[i].title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offers[i].price}</span>
    </label>
  </div>`;
  }

  return result;
}

function createPointEditTemplate (point, destination, offers) {
  return (`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class=" event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${point.eventType}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypeTemplate(offers, point.eventType)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${point.eventType}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${createDestinationList(destination)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${createOffersTemplate(offers)}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createPicturesTemplate(destination.pictures)}
          </div>
        </div>
      </section>
    </section>
  </form>
  </li>`);
}


export default class EditPointView extends AbstractView {
  #point = null;
  #pointDestination = null;
  #pointOffers = null;
  #onSubmit = null;
  #onCloseButtonClick = null;

  constructor(point = {
    basePrice: 0,
    dateFrom: null,
    dateTo: null,
    destination: null,
    isFavorite: false,
    offers: [],
    type: 'flight'
  }, pointDestination, pointOffers, onSubmit, onCloseButtonClick) {
    super();
    this.#point = point;
    this.#pointDestination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#onSubmit = onSubmit;
    this.#onCloseButtonClick = onCloseButtonClick;

    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onCloseButtonClick);
    this.element.querySelector('form').addEventListener('submit', this.#onSubmit);
  }

  get template() {
    return createPointEditTemplate(this.#point, this.#pointDestination, this.#pointOffers);
  }
}
