import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { DateFormat, MS_IN_DAY, MS_IN_HOUR } from '../const.js';
dayjs.extend(duration);

export function getTime(date) {
  return dayjs(date).format('HH:mm');
}

export function getMonthAndDay(date) {
  return dayjs(date).format('MMM DD');
}

export function getFullDate(date) {
  return dayjs(date).format('DD/MM/YY HH:mm');
}

export function getTimeInHours(startTime, endTime) {
  const hours = dayjs(endTime).diff(dayjs(startTime), 'hours');
  return hours === 0 ? '' : `${hours}H`;
}

export function getTimeInMinutes(startTime, endTime) {
  const minutes = dayjs(endTime).diff(dayjs(startTime), 'minutes') % 60;
  return minutes === 0 ? '' : `${minutes}M`;
}

export const isPastEvent = (date) => dayjs(date).isBefore(dayjs());

export const isPresentEvent = (dateFrom, dateTo) => dayjs(dateFrom).isBefore(dayjs()) && dayjs(dateTo).isAfter(dayjs());

export const isFutureEvent = (date) => dayjs(date).isAfter(dayjs());

export const formatToLongDate = (dueDate) => dueDate ? dayjs(dueDate).format(DateFormat.LONG) : '';

export const formatToShortDate = (time) => time ? dayjs(time).format(DateFormat.SHORT) : '';

export const formatToShortTime = (time) => time ? dayjs(time).format(DateFormat.TIME) : '';

export const getDuration = (dateFrom, dateTo) => {
  const timeDifference = dayjs(dateTo).diff(dayjs(dateFrom));

  if (timeDifference >= MS_IN_DAY) {
    return dayjs.duration(timeDifference).format('DD[D] HH[H] mm[M]');
  } else if (timeDifference >= MS_IN_HOUR) {
    return dayjs.duration(timeDifference).format('HH[H] mm[M]');
  } else if (timeDifference < MS_IN_HOUR) {
    return dayjs.duration(timeDifference).format('mm[M]');
  }
};

export const sortByDate = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

export const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortByTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
};
