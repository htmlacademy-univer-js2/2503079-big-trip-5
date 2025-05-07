import AbstractView from '../framework/view/abstract-view.js';

const createTripInfoTitle = (destinations) => {
  if (!destinations || destinations.length === 0) {
    return '';
  }
  return destinations.filter(Boolean).map((d) => d.name).join(' &mdash; ');
};

function createTripInfoTemplate (destinations, totalPrice){
  return(`<section class="trip-main__trip-info  trip-info"> <div class="trip-info__main">   <h1 class="trip-info__title">${createTripInfoTitle(destinations)}</h1>    <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p> </div>  <p class="trip-info__cost">   Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span> </p> </section>`);
}

export default class TripInfoView extends AbstractView {
  #points = null;
  #destinations = null;

  constructor(destinations, points) {
    super();
    this.#points = points;
    this.#destinations = destinations;
  }

  get template() {
    let totalPrice = 0;
    for (let i = 0; i < this.#points.length; i++) {
      totalPrice += this.#points[i].basePrice;
    }
    return createTripInfoTemplate(this.#destinations, totalPrice);
  }
}
