import dayjs from 'dayjs';

function getRandomArrayElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomUUID(){
  return crypto.randomUUID();
}

function getTime(date) {
  return dayjs(date).format('hh:mm');
}

function getMonthAndDay(date) {
  return dayjs(date).format('MMM DD');
}

function getFullDate(date) {
  return dayjs(date).format('DD/MM/YY hh:mm');
}

function getRandomValue(lower = 0, upper = 1000) {
  return Math.round((upper - lower) * Math.random() + lower);
}

function getTimeInHours(startTime, endTime) {
  const hours = dayjs(endTime).diff(dayjs(startTime), 'hours');
  return hours === 0 ? '' : `${hours}H`;
}

function getTimeInMinutes(startTime, endTime) {
  const minutes = dayjs(endTime).diff(dayjs(startTime), 'minutes') % 60;
  return minutes === 0 ? '' : `${minutes}M`;
}

const getRandomPositiveNumber = (max) => Math.ceil(Math.random() * max);


export { getFullDate, getMonthAndDay, getRandomArrayElement, getRandomPositiveNumber, getRandomUUID, getRandomValue, getTime, getTimeInHours, getTimeInMinutes };

