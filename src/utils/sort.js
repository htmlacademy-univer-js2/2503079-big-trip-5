import { Sorts } from '../const.js';

import dayjs from 'dayjs';

const getTimeDifference = (point) => dayjs(point.dateTo).diff(dayjs(point.dateFrom));

const sortByDay = (pointA, pointB) => dayjs(pointB.dateTo).diff(dayjs(pointA.dateTo));

const sortByTime = (pointA, pointB) => getTimeDifference(pointB) - getTimeDifference(pointA);

const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sort = {
  [Sorts.DAY]: (array) => array.sort(sortByDay),
  [Sorts.TIME]: (array) => array.sort(sortByTime),
  [Sorts.PRICE]: (array) => array.sort(sortByPrice)
};

export {sort};
