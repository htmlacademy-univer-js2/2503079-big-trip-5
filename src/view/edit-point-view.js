import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { CITIES, DateFormat, TYPE_POINTS } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const DEFAULT_POINT = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'flight'
};

function createPicturesTemplate (pictures){
  let result = '';

  for (let i = 0; i < pictures.length; i++) {
    result += `<img class="event__photo" src=${pictures[i].src} alt="Event photo">`;
  }

  return result;
}

function createEventTypeTemplate (currentType) {
  let result = '';
  let typeL = '';

  for (let i = 0; i < TYPE_POINTS.length; i++) {
    typeL = TYPE_POINTS[i].toLowerCase();
    result += `<div class="event__type-item">
    <input id="event-type-${typeL}-${i + 1}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeL}" ${currentType === typeL ? 'checked' : ''}>
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

function createOffersTemplate (offers, selectedOffers) {
  let result = '';

  for (let i = 0; i < offers.length; i++) {
    const isChecked = selectedOffers.some((offer) => offer.id === offers[i].id);
    result += `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offers[i].id}" type="checkbox" name="event-offer" value="${offers[i].id}" ${isChecked ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${offers[i].id}">
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
          <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypeTemplate(point.type)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${point.type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1" required>
        <datalist id="destination-list-1">
          ${createDestinationList()}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${point.dateFrom}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${point.dateTo}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${point.basePrice}" min="0" required>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Close event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${createOffersTemplate(offers, point.offers)}
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

export default class EditPointView extends AbstractStatefulView {
  #point = null;
  #pointDestination = null;
  #pointOffers = null;
  #onSubmit = null;
  #onCloseButtonClick = null;
  #allOffers = null;
  #dateFromPicker = null;
  #dateToPicker = null;

  #saveClickHandler = null;
  #rollUpClickHandler = null;
  #deleteClickHandler = null;

  constructor({point = DEFAULT_POINT, destination, offers, allOffers, onSaveClick, onRollUpClick, onDeleteClick}) {
    super();
    this.#saveClickHandler = onSaveClick;
    this.#rollUpClickHandler = onRollUpClick;
    this.#deleteClickHandler = onDeleteClick;
    this.#pointDestination = destination;
    this.#pointOffers = offers;
    this.#allOffers = allOffers;

    this._setState({
      point: EditPointView.parsePointToState(point).point,
      destination: this.#pointDestination,
      offers: this.#pointOffers
    });

    this._restoreHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createPointEditTemplate(this._state.point, this._state.destination, this._state.offers);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editPointRollUpHandler);
    this.element.querySelector('form').addEventListener('submit', this.#editPointSaveHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#editPointDeleteHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersChangeHandler);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      evt.stopPropagation();
      this.#rollUpClickHandler();
    }
  };

  #editPointRollUpHandler = (evt) => {
    evt.preventDefault();
    this.#rollUpClickHandler();
  };

  #editPointSaveHandler = (evt) => {
    evt.preventDefault();
    const destinationInput = this.element.querySelector('.event__input--destination');
    const priceInput = this.element.querySelector('.event__input--price');

    if (!destinationInput.value || !CITIES.some((city) => city.name === destinationInput.value)) {
      destinationInput.setCustomValidity('Please select a valid destination from the list');
      destinationInput.reportValidity();
      return;
    }

    if (!priceInput.value || priceInput.value < 0) {
      priceInput.setCustomValidity('Please enter a valid positive number');
      priceInput.reportValidity();
      return;
    }

    this.#saveClickHandler(EditPointView.parseStateToPoint(this._state));
  };

  #editPointDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#deleteClickHandler(EditPointView.parseStateToPoint(this._state));
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    const value = parseInt(evt.target.value, 10);
    if (value < 0) {
      evt.target.value = 0;
    }
    this._setState({
      ...this._state,
      point: {
        ...this._state.point,
        basePrice: value
      }
    });
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    const newType = evt.target.value;
    const typeOffers = this.#allOffers.find((offer) => offer.type.toLowerCase() === newType.toLowerCase());
    const newOffers = typeOffers ? typeOffers.offers : [];

    // Сохраняем текущие выбранные offers
    const currentOffers = this._state.point.offers;

    this._setState({
      ...this._state,
      point: {
        ...this._state.point,
        type: newType,
        offers: currentOffers // Сохраняем текущие offers
      },
      offers: newOffers
    });

    const typeIcon = this.element.querySelector('.event__type-icon');
    if (typeIcon) {
      typeIcon.src = `img/icons/${newType}.png`;
    }

    const typeLabel = this.element.querySelector('.event__type-output');
    if (typeLabel) {
      typeLabel.textContent = newType;
    }

    const offersSection = this.element.querySelector('.event__available-offers');
    if (offersSection) {
      offersSection.innerHTML = createOffersTemplate(newOffers, currentOffers);
    }
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const newDestinationName = evt.target.value;
    const newDestination = CITIES.find((city) => city.name === newDestinationName);

    if (newDestination) {
      const updatedState = {
        ...this._state,
        point: {
          ...this._state.point,
          destination: newDestination.id
        },
        destination: newDestination
      };

      this._setState(updatedState);

      // Обновляем описание и фотографии
      const descriptionElement = this.element.querySelector('.event__destination-description');
      const photosContainer = this.element.querySelector('.event__photos-tape');

      if (descriptionElement) {
        descriptionElement.textContent = newDestination.description;
      }

      if (photosContainer) {
        photosContainer.innerHTML = createPicturesTemplate(newDestination.pictures);
      }
    }
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    const offerId = evt.target.value;
    const isChecked = evt.target.checked;

    let newOffers = [...this._state.point.offers];

    if (isChecked) {
      const offer = this._state.offers.find((o) => o.id === offerId);
      if (offer) {
        newOffers.push(offer);
      }
    } else {
      newOffers = newOffers.filter((o) => o.id !== offerId);
    }

    this._setState({
      ...this._state,
      point: {
        ...this._state.point,
        offers: newOffers
      }
    });
  };

  static parsePointToState(point) {
    return {
      point: {
        ...point
      }
    };
  }

  static parseStateToPoint(state) {
    return {
      ...state.point
    };
  }

  updateElement(update) {
    const prevState = this._state;
    this._setState(update);

    if (prevState.point.dateFrom !== this._state.point.dateFrom ||
        prevState.point.dateTo !== this._state.point.dateTo) {
      this.#setDatepicker();
    }
  }

  #setDatepicker() {
    const dateFromInput = this.element.querySelector('#event-start-time-1');
    const dateToInput = this.element.querySelector('#event-end-time-1');

    if (this.#dateFromPicker) {
      this.#dateFromPicker.destroy();
    }
    if (this.#dateToPicker) {
      this.#dateToPicker.destroy();
    }

    const commonConfig = {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      time24hr: true,
      locale: {
        firstDayOfWeek: 1
      },
      parseDate: function(date) {
        return flatpickr.parseDate(date, 'Y-m-d\\TH:i');
      }
    };

    const defaultDateFrom = this._state.point.dateFrom;
    const defaultDateTo = this._state.point.dateTo;

    dateFromInput.value = dayjs(defaultDateFrom).format(DateFormat.TIME);
    dateToInput.value = dayjs(defaultDateTo).format(DateFormat.TIME);

    this.#dateFromPicker = flatpickr(dateFromInput, {
      ...commonConfig,
      defaultDate: defaultDateFrom,
      maxDate: defaultDateTo,
      onClose: ([selectedDate]) => {
        const formattedDate = dayjs(selectedDate).format(DateFormat.LONG);
        this.updateElement({
          point: {
            ...this._state.point,
            dateFrom: formattedDate
          }
        });
        if (this.#dateToPicker) {
          this.#dateToPicker.set('minDate', selectedDate);
        }
      }
    });

    this.#dateToPicker = flatpickr(dateToInput, {
      ...commonConfig,
      defaultDate: defaultDateTo,
      minDate: defaultDateFrom,
      onClose: ([selectedDate]) => {
        const formattedDate = dayjs(selectedDate).format(DateFormat.LONG);
        this.updateElement({
          point: {
            ...this._state.point,
            dateTo: formattedDate
          }
        });
        if (this.#dateFromPicker) {
          this.#dateFromPicker.set('maxDate', selectedDate);
        }
      }
    });
  }

  removeElement() {
    if (this.#dateFromPicker) {
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }
    if (this.#dateToPicker) {
      this.#dateToPicker.destroy();
      this.#dateToPicker = null;
    }
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    super.removeElement();
  }
}
