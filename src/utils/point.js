import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { MS_IN_DAY, MS_IN_HOUR } from '../const.js';
dayjs.extend(duration);

const getDuration = (dateFrom, dateTo) => {
  const timeDifference = dayjs(dateTo).diff(dayjs(dateFrom));

  if (timeDifference >= MS_IN_DAY) {
    return dayjs.duration(timeDifference).format('DD[D] HH[H] mm[M]');
  } else if (timeDifference >= MS_IN_HOUR) {
    return dayjs.duration(timeDifference).format('HH[H] mm[M]');
  } else if (timeDifference < MS_IN_HOUR) {
    return dayjs.duration(timeDifference).format('mm[M]');
  }
};

function sortPointDay(points) {
  return points.sort((firstPoint, secondPoint) => new Date(firstPoint.dateFrom) - new Date(secondPoint.dateFrom));
}

function sortPointTime(points) {
  return points.sort((firstPoint, secondPoint) =>
    dayjs(firstPoint.dateFrom).diff(dayjs(firstPoint.dateTo), 'minutes') -
    dayjs(secondPoint.dateFrom).diff(dayjs(secondPoint.dateTo), 'minutes'));
}

function sortPointPrice(points) {
  return points.sort((firstPoint, secondPoint) => secondPoint.price - firstPoint.price);
}

function getDefaultPoint() {
  return {
    basePrice: 0,
    type: 'flight',
    destination: {
      id: null,
      name: '',
      description: '',
      pictures: []
    },
    dateFrom: dayjs().format('YYYY-MM-DDTHH:mm'),
    dateTo: dayjs().add(1, 'hour').format('YYYY-MM-DDTHH:mm'),
    offers: [],
    isFavorite: false
  };
}

export {sortPointTime, sortPointPrice, sortPointDay, getDuration, getDefaultPoint};
