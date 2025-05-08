import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';

const createTripInfoTitle = (points, destinations) => {
  if (!points || points.length === 0) {
    return 'There are no present events now';
  }

  const destinationNames = points.map((point) => {
    const destination = destinations.find((d) => d.id === point.destination);
    return destination ? destination.name : '';
  }).filter(Boolean);

  if (destinationNames.length <= 2) {
    return destinationNames.join(' &mdash; ');
  }

  return `${destinationNames[0]} &mdash; ... &mdash; ${destinationNames[destinationNames.length - 1]}`;
};

const formatTripDates = (points) => {
  if (!points || points.length === 0) {
    return '';
  }

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  const startDate = dayjs(firstPoint.dateFrom).format('MMM DD');
  const endDate = dayjs(lastPoint.dateTo).format('MMM DD');

  return `${startDate}&nbsp;&mdash;&nbsp;${endDate}`;
};

function createTripInfoTemplate(points, destinations, totalPrice) {
  return(`<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${createTripInfoTitle(points, destinations)}</h1>
      <p class="trip-info__dates">${formatTripDates(points)}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
  </section>`);
}

export default class TripInfoView extends AbstractView {
  #points = null;
  #destinations = null;

  constructor(points, destinations) {
    super();
    this.#points = points;
    this.#destinations = destinations;
  }

  get template() {
    const totalPrice = this.#points.reduce((sum, point) => sum + point.price, 0);
    return createTripInfoTemplate(this.#points, this.#destinations, totalPrice);
  }
}
