import { OFFERS } from '../const.js';
import { getRandomArrayElement, getRandomUUID } from '../utils/common.js';

export function getRandomOffer() {
  const offer = getRandomArrayElement(OFFERS);
  return {
    id: getRandomUUID(),
    title: offer.title,
    price: offer.price
  };
}
