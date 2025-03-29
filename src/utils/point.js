import dayjs from 'dayjs';

export function getTime(date) {
  return dayjs(date).format('hh:mm');
}

export function getMonthAndDay(date) {
  return dayjs(date).format('MMM DD');
}

export function getFullDate(date) {
  return dayjs(date).format('DD/MM/YY hh:mm');
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
