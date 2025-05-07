export default class OffersModel {
  constructor(service) {
    this.service = service;
    this.offers = this.service.offers;
  }

  get = () => this.offers;

  getByType = (type) => {
    const foundOffer = this.offers.find((offer) => offer.type === type);
    return foundOffer ? foundOffer.offers : [];
  };
}
