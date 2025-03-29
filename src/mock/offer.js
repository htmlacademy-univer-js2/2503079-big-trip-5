import { OFFERS } from '../const.js';
import { getRandomArrayElement, getRandomUUID } from '../utils/common.js';

export function getMockOffers() {
  const offersCount = Math.floor(Math.random() * 5 + 1);
  return getRandomOffers(offersCount);
}


function getRandomOffers(offersCount) {
  return Array.from({ length: offersCount }, () => {
    const offer = getRandomArrayElement(OFFERS);
    return {
      id: getRandomUUID(),
      title: offer.title,
      price: offer.price
    };
  });
}
