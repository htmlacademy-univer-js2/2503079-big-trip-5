import dayjs from 'dayjs';
import { DATES } from '../const.js';
import { getRandomArrayElement, getRandomUUID, getRandomValue } from '../utils/common.js';

export function getMockPoint(type, destinationId, offersIds) {
  const date = getRandomArrayElement(DATES);
  const isFavorite = Math.floor(Math.random() * 10) % 2 === 0;
  const point = {
    id: getRandomUUID(),
    basePrice: getRandomValue(100, 1000),
    type: type,
    destination: destinationId,
    dateFrom: date.from,
    dateTo: date.to,
    offers: offersIds,
    isFavorite: isFavorite,
  };
  return point;
}

export function getDefaultPoint() {
  return {
    id: getRandomUUID(),
    basePrice: 0,
    type: 'flight',
    destination: null,
    dateFrom: dayjs().format('YYYY-MM-DDTHH:mm'),
    dateTo: dayjs().add(1, 'hour').format('YYYY-MM-DDTHH:mm'),
    offers: [],
    isFavorite: false
  };
}

