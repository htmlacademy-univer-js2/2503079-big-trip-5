import { DATES } from '../const.js';
import { getRandomArrayElement } from '../utils/common.js';

import { getRandomUUID, getRandomValue } from '../utils/common.js';

export function getMockPoint(type, destinationId, offersIds){
  const date = getRandomArrayElement(DATES);
  const isFavorite = Math.floor(Math.random() * 10) % 2 === 0;
  const point = {
    id: getRandomUUID(),
    basePrice: getRandomValue(100, 1000),
    eventType: type,
    destination: destinationId,
    dateFrom: date.from,
    dateTo: date.to,
    offers: offersIds,
    isFavorite: isFavorite,
  };
  return point;
}

