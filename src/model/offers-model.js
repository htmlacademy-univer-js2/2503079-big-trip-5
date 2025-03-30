export default class OffersModel {
  constructor(service) {
    this.service = service;
    this.offers = this.service.offers;
  }

  get = () => this.offers;

  getByType = (type) => this.offers.find((offer) => offer.type === type).offers;
}
