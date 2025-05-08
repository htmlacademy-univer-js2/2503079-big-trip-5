export default class DestinationsModel {
  #destinations = [];
  #service = null;

  constructor(service) {
    this.#service = service;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#service.destinations;
      return Promise.resolve();
    } catch (err) {
      this.#destinations = [];
      return Promise.reject(err);
    }
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
