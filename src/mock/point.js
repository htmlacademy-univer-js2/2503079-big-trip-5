import { DATES, TYPE_POINTS, } from '../const.js';
import { getRandomArrayElement } from '../utils/common.js';
import { getMockDestination } from './destination.js';
import { getMockOffers } from './offer.js';

import { getRandomValue } from '../utils/common.js';

export function getMockPoint(){
  const date = getRandomArrayElement(DATES);
  const type = getRandomArrayElement(TYPE_POINTS);
  const isFavorite = Math.floor(Math.random() * 10) % 2 === 0;
  return {
    eventType: getRandomArrayElement(TYPE_POINTS),
    destination: getMockDestination(),
    startDatetime: date.from,
    endDatetime: date.to,
    price: getRandomValue(),
    offers: getMockOffers(type),
    isFavorite: isFavorite,
  };
}

