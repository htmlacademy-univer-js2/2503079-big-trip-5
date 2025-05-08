export default class OffersModel {
  #offers = [];
  #service = null;

  constructor(service) {
    this.#service = service;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      this.#offers = await this.#service.offers;
      return Promise.resolve();
    } catch (err) {
      this.#offers = [];
      return Promise.reject(err);
    }
  }

  getByType(type) {
    return this.#offers.find((offer) => offer.type.toLowerCase() === type.toLowerCase());
  }

  get() {
    return this.#offers;
  }
}
