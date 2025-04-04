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
