import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { DateFormat, TYPE_POINTS } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

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

function createDestinationList (destinations) {
  let result = '';

  for (let i = 0; i < destinations.length; i++) {
    result += `<option value="${destinations[i].name}"></option>`;
  }

  return result;
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

function createPointEditTemplate (point, destination, offers, isSaving, isDeleting) {
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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1" required ${isDisabled ? 'disabled' : ''}>
        <datalist id="destination-list-1">
          ${createDestinationList(destination)}
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
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${point.price}" min="0" max="100000" required ${isDisabled ? 'disabled' : ''}>
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
    const typeOffers = this.#allOffers.find((offer) => offer.type.toLowerCase() === this._state.point.type.toLowerCase());
    const availableOffers = typeOffers ? typeOffers.offers : [];
    return createPointEditTemplate(this._state.point, this._state.destination, availableOffers, this.#isSaving, this.#isDeleting);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editPointRollUpHandler);
    this.element.querySelector('form').addEventListener('submit', this.#editPointSaveHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#editPointDeleteHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationInputHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersChangeHandler);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      evt.stopPropagation();
      this.#handleRollUpClick();
    }
  };

  #editPointRollUpHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollUpClick();
  };

  #editPointSaveHandler = async (evt) => {
    evt.preventDefault();
    const destinationInput = this.element.querySelector('.event__input--destination');
    const priceInput = this.element.querySelector('.event__input--price');

    const selectedCity = this.#destinations.find((city) => city.name === destinationInput.value);
    if (!selectedCity) {
      destinationInput.setCustomValidity('Please select a valid destination from the list');
      destinationInput.reportValidity();
      return;
    }

    const price = Number(priceInput.value);
    if (!price || price < 0) {
      priceInput.setCustomValidity('Please enter a valid positive number');
      priceInput.reportValidity();
      return;
    }

    if (price > 100000) {
      priceInput.setCustomValidity('Price must not exceed 100,000');
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

      // Validate dates
      if (new Date(point.dateFrom) > new Date(point.dateTo)) {
        throw new Error('End date must be after start date');
      }

      await this.#handleSaveClick(point);
    } catch (err) {
      this.shake();
      throw err; // Пробрасываем ошибку дальше для обработки в презентере
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
      throw err; // Пробрасываем ошибку дальше для обработки в презентере
    } finally {
      this.#isDeleting = false;
      this.updateElement({ ...this._state, isDeleting: false });
    }
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
        price: value
      }
    });
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
        offers: [] // Сбрасываем выбранные offers при смене типа
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

    // Очищаем текущий datalist
    const datalist = this.element.querySelector('#destination-list-1');
    datalist.innerHTML = '';

    // Фильтруем и добавляем подходящие города
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
    // Не удаляем offers, так как они нужны для сохранения
    return point;
  }

  updateElement(update) {
    this._setState(update);
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;
    parent.replaceChild(newElement, prevElement);
    this._restoreHandlers();
    this.#setDatepicker();
  }

  #setDatepicker() {
    const dateFromInput = this.element.querySelector('#event-start-time-1');
    const dateToInput = this.element.querySelector('#event-end-time-1');

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
    }

    const commonConfig = {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      time24hr: true,
      locale: {
        firstDayOfWeek: 1
      }
    };

    this.#datepickerFrom = flatpickr(dateFromInput, {
      ...commonConfig,
      defaultDate: this._state.point.dateFrom,
      maxDate: this._state.point.dateTo,
      onChange: ([selectedDate]) => {
        this._setState({
          ...this._state,
          point: {
            ...this._state.point,
            dateFrom: selectedDate.toISOString()
          }
        });
        this.#datepickerTo.set('minDate', selectedDate);
      }
    });

    this.#datepickerTo = flatpickr(dateToInput, {
      ...commonConfig,
      defaultDate: this._state.point.dateTo,
      minDate: this._state.point.dateFrom,
      onChange: ([selectedDate]) => {
        this._setState({
          ...this._state,
          point: {
            ...this._state.point,
            dateTo: selectedDate.toISOString()
          }
        });
        this.#datepickerFrom.set('maxDate', selectedDate);
      }
    });
  }

  removeElement() {
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
    document.removeEventListener('keydown', this.#escKeyDownHandler);
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
