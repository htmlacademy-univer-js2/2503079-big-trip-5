import { TYPE_POINTS } from '../const.js';
import { getMockDestinations } from '../mock/destination.js';
import { getRandomOffer } from '../mock/offer.js';
import { getMockPoint } from '../mock/point.js';
import { getRandomArrayElement, getRandomValue } from '../utils/common.js';

export default class MockService {
  #destinations = [];
  #offers = [];
  #points = [];

  constructor() {
    this.#destinations = getMockDestinations(5);
    this.#offers = this.generateOffers();
    this.#points = this.generatePoints();
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get points() {
    return this.#points;
  }

  generateOffers = () => TYPE_POINTS.map((type) => {
    const length = getRandomValue(1, 5);
    return {
      type,
      offers: Array.from({length: length}, () => getRandomOffer())
    };
  });

  generatePoints = () => Array.from({length: getRandomValue(0, 4)}, () => {
    const type = getRandomArrayElement(TYPE_POINTS);

    const destinations = getRandomArrayElement(this.#destinations);

    const hasOffers = getRandomValue(0, 1);

    const offersByType = this.#offers.find((offer) => offer.type === type);

    let offerIds = [];

    if (hasOffers) {
      offerIds = offersByType.offers.map((offer) => offer.id);
    }
    return getMockPoint(type, destinations.id, offerIds);
  });
}
