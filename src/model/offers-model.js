import { getMockOffers } from '../mock/offer.js';

export default class OffersModel {
  offers = getMockOffers();

  getOffers(){
    return this.offers;
  }

  getOfferByType(type){
    return this.offers.find((offer) => offer.type === type);
  }
}
