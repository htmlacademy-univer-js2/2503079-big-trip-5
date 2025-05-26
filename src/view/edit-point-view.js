import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import {DateFormat, TYPE_POINTS, VALIDATION_ERRORS} from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createPicturesTemplate (pictures){
  let result = '';

  for (let i = 0; i < pictures.length; i++) {
    result += `<img class="event__photo" src=${pictures[i].src} alt={pictures[i].description}>`;
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

function createDestinationList(destinations) {
  return destinations
    .map((dest) => `<option value="${dest.name}"></option>`)
    .join('');
}

function createOffersTemplate (offers, selectedOffers) {
  if (!offers || offers.length === 0) {
    return '';
  }

  return offers.map((offer) => {
    const isChecked = selectedOffers.includes(offer.id);
    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer" value="${offer.id}" ${isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  }).join('');
}

function createPointEditTemplate (point, destination, offers, allDestinations, isSaving, isDeleting) {
  const dateFrom = dayjs(point.dateFrom).format(DateFormat.LONG);
  const dateTo = dayjs(point.dateTo).format(DateFormat.LONG);
  const isDisabled = isSaving || isDeleting;

  return (`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

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
          <input
            class="event__input  event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value="${destination.name}"
            list="destination-list-1"
            required
            ${isDisabled ? 'disabled' : ''}
          >
          <datalist id="destination-list-1">
            ${createDestinationList(allDestinations)}
          </datalist>
        </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}" ${isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}" ${isDisabled ? 'disabled' : ''}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input
        class="event__input  event__input--price"
        id="event-price-1"
        type="number"
        name="event-price"
        value="${point.price ?? 0}"
        min="0"
        max="100000"
        required
        oninput="this.value = this.value < 0 ? 0 : this.value"
        ${isDisabled ? 'disabled' : ''}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
      <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
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
  #destinations = null;
  #offers = null;
  #allOffers = null;
  #handleSaveClick = null;
  #handleDeleteClick = null;
  #handleRollUpClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #isSaving = false;
  #isDeleting = false;

  constructor({ point, destination, offers, allOffers, onSaveClick, onDeleteClick, onRollUpClick, destinationsModel }) {
    super();
    this.#point = point;
    this.#destinations = destinationsModel.destinations;
    this.#offers = offers;
    this.#allOffers = allOffers;
    this.#handleSaveClick = onSaveClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleRollUpClick = onRollUpClick;

    this._setState({
      ...EditPointView.parsePointToState(point, destination, offers),
      isSaving: false,
      isDeleting: false
    });

    this._restoreHandlers();
    this.#setDatepicker();
  }

  get template() {
    const typeOffers = this.#allOffers.find((offer) =>
      offer.type.toLowerCase() === this._state.point.type.toLowerCase()
    );
    const availableOffers = typeOffers ? typeOffers.offers : [];
    return createPointEditTemplate(
      this._state.point,
      this._state.destination,
      availableOffers,
      this.#destinations,
      this._state.isSaving,
      this._state.isDeleting
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editPointRollUpHandler);
    this.element.querySelector('form').addEventListener('submit', this.#editPointSaveHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#editPointDeleteHandler);
    this.element
      .querySelector('.event__input--price')
      .addEventListener('input', (evt) => {
        evt.target.setCustomValidity('');
      });
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationInputHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersChangeHandler);
  }

  #editPointRollUpHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollUpClick();
  };

  #editPointSaveHandler = async (evt) => {
    evt.preventDefault();
    this.element.querySelectorAll('input').forEach((i) => i.setCustomValidity(''));
    const destinationInput = this.element.querySelector('.event__input--destination');
    const priceInput = this.element.querySelector('.event__input--price');

    destinationInput.setCustomValidity('');
    priceInput.setCustomValidity('');

    const selectedCity = this.#destinations.find((city) => city.name === destinationInput.value);
    if (!selectedCity) {
      destinationInput.setCustomValidity(VALIDATION_ERRORS.INVALID_DESTINATION);
      destinationInput.reportValidity();
      return;
    }

    const price = Number(priceInput.value);
    if (!Number.isFinite(price) || price <= 0) {
      priceInput.setCustomValidity(VALIDATION_ERRORS.INVALID_PRICE);
      priceInput.reportValidity();
      return;
    }

    if (price > 100000) {
      priceInput.setCustomValidity(VALIDATION_ERRORS.PRICE_EXCEEDS_LIMIT);
      priceInput.reportValidity();
      return;
    }

    try {
      this.#isSaving = true;
      this.updateElement({ ...this._state, isSaving: true });

      const point = EditPointView.parseStateToPoint(this._state);
      point.destination = selectedCity.id;
      point.offers = this._state.point.offers;
      point.price = price;
      point.basePrice = price;
      point.dateFrom = new Date(point.dateFrom).toISOString();
      point.dateTo = new Date(point.dateTo).toISOString();

      if (new Date(point.dateFrom) > new Date(point.dateTo)) {
        throw new Error(VALIDATION_ERRORS.DATE_ORDER);
      }

      await this.#handleSaveClick(point);
    } catch (err) {
      this.shake();
      throw err;
    } finally {
      this.#isSaving = false;
      this.updateElement({ ...this._state, isSaving: false });
    }
  };

  #editPointDeleteHandler = async (evt) => {
    evt.preventDefault();
    try {
      this.#isDeleting = true;
      this.updateElement({ ...this._state, isDeleting: true });
      await this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
    } catch (err) {
      this.shake();
      throw err;
    } finally {
      this.#isDeleting = false;
      this.updateElement({ ...this._state, isDeleting: false });
    }
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    const newType = evt.target.value;
    const typeOffers = this.#allOffers.find((offer) => offer.type.toLowerCase() === newType.toLowerCase());
    const newOffers = typeOffers ? typeOffers.offers : [];

    this._setState({
      ...this._state,
      point: {
        ...this._state.point,
        type: newType,
        offers: []
      }
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
      offersSection.innerHTML = createOffersTemplate(newOffers, []);
    }
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    const input = evt.target;
    const value = input.value.toLowerCase();

    const datalist = this.element.querySelector('#destination-list-1');
    datalist.innerHTML = '';

    const matchingDestinations = this.#destinations.filter((dest) =>
      dest.name.toLowerCase().includes(value)
    );

    matchingDestinations.forEach((dest) => {
      const option = document.createElement('option');
      option.value = dest.name;
      datalist.appendChild(option);
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const newDestinationName = evt.target.value;
    const newDestination = this.#destinations.find((city) => city.name === newDestinationName);

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
      if (!newOffers.includes(offerId)) {
        newOffers.push(offerId);
      }
    } else {
      newOffers = newOffers.filter((id) => id !== offerId);
    }

    this._setState({
      ...this._state,
      point: {
        ...this._state.point,
        offers: newOffers
      }
    });
  };

  static parsePointToState(point, destination, offers) {
    return {
      point,
      destination,
      offers
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state.point };
    delete point.destination;
    return point;
  }

  updateElement(update) {
    this._setState(update);
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    if (!parent) {
      return;
    }
    this.removeElement();

    const newElement = this.element;
    parent.replaceChild(newElement, prevElement);
    this._restoreHandlers();
    this.#setDatepicker();
  }

  #setDatepicker = () => {
    const [fromEl, toEl] = this.element.querySelectorAll('.event__input--time');

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }

    const rawFrom = this._state.point.dateFrom;
    const rawTo = this._state.point.dateTo;
    const dateFrom = rawFrom instanceof Date ? rawFrom : new Date(rawFrom);
    const dateTo = rawTo instanceof Date ? rawTo : new Date(rawTo);

    const common = {
      enableTime: true,
      dateFormat: 'd/m/Y H:i',
      locale: { firstDayOfWeek: 1 }
    };

    this.#datepickerFrom = flatpickr(fromEl, {
      ...common,
      defaultDate: dateFrom,
      maxDate: dateTo,
      onChange: ([d]) => {
        this._setState({
          ...this._state,
          point: { ...this._state.point, dateFrom: d }
        });
        this.#datepickerTo.set('minDate', d);
      }
    });

    this.#datepickerTo = flatpickr(toEl, {
      ...common,
      defaultDate: dateTo,
      minDate: dateFrom,
      onChange: ([d]) => {
        this._setState({
          ...this._state,
          point: { ...this._state.point, dateTo: d }
        });
        this.#datepickerFrom.set('maxDate', d);
      }
    });
  };

  removeElement() {
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
    super.removeElement();
  }

  reset = (point) => {
    this.updateElement(EditPointView.parsePointToState(point, this.#destinations.find((dest) => dest.id === point.destination), this.#offers));
  };

  shake() {
    this.element.classList.add('shake');
    setTimeout(() => {
      this.element.classList.remove('shake');
    }, 600);
  }
}
