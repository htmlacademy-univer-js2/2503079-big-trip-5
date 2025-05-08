import dayjs from 'dayjs';

export function getRandomArrayElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomUUID(){
  return crypto.randomUUID();
}

export function getRandomValue(lower, upper) {
  return Math.round((upper - lower) * Math.random() + lower);
}

export const getRandomPositiveNumber = (max) => Math.ceil(Math.random() * max);

export const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

export const removeHandlerOnEscape = (cb) => document.removeEventListener('keydown', cb);

export const onEscapeKeyDown = (evt) => {
  if (evt.key === 'Escape') {
    removeHandlerOnEscape(onEscapeKeyDown);
  }
};

export const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');


export function adaptToClient(point) {
  console.log('adaptToClient input:', point);
  console.log('base_price value:', point.base_price);

  const adaptedPoint = {
    ...point,
    price: point.base_price,
    dateFrom: point.date_from !== null ? new Date(point.date_from) : point.date_from,
    dateTo: point.date_to !== null ? new Date(point.date_to) : point.date_to,
    isFavorite: point.is_favorite
  };

  console.log('adaptedPoint before deletion:', adaptedPoint);

  delete adaptedPoint.base_price;
  delete adaptedPoint.date_from;
  delete adaptedPoint.date_to;
  delete adaptedPoint.is_favorite;

  console.log('adaptedPoint after deletion:', adaptedPoint);
  return adaptedPoint;
}

export function updatePoints(points, update) {
  return points.map((point) => point.id === update.id ? update : point);
}

function formatDateForServer(date) {
  if (date instanceof Date) {
    return date.toISOString();
  }
  if (typeof date === 'string') {
    return date;
  }
  return null;
}

export function adaptToServer(point) {
  const adaptedPoint = {
    id: point.id,
    type: point.type,
    destination: point.destination,
    ['base_price']: Number(point.price),
    ['date_from']: formatDateForServer(point.dateFrom),
    ['date_to']: formatDateForServer(point.dateTo),
    ['is_favorite']: Boolean(point.isFavorite),
    offers: point.offers // Отправляем массив ID offers как есть
  };

  return adaptedPoint;
}
