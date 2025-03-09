import { DATES, TYPE_POINTS } from '../const.js';
import { getRandomArrayElement, getRandomUUID } from '../utils.js';
import { getMockDestination } from './destination.js';
import { getMockOffers } from './offer.js';

export function getMockPoint(){
  const date = getRandomArrayElement(DATES);
  const type = getRandomArrayElement(TYPE_POINTS);
  const isFavorite = Math.floor(Math.random() * 10) % 2 === 0;
  return {
    'id' : getRandomUUID(),
    'basePrice': '110',
    'dateFrom': date.from,
    'dateTo': date.to,
    'destination': getMockDestination(),
    'isFavourite': isFavorite,
    'offers': getMockOffers(type),
    'type': type
  };
}
