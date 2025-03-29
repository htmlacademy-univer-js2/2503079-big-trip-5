import { CITIES } from '../const.js';
import { getRandomArrayElement } from '../utils/common.js';

const PICTURES_COUNT = 5;

export function getMockDestination() {
  const city = getRandomArrayElement(CITIES);
  return {
    city: city.name,
    description: city.description,
    pictures: Array.from({ length: PICTURES_COUNT }, () => ({
      src: `https://loremflickr.com/248/152/?random=${Math.floor(Math.random() * (PICTURES_COUNT * PICTURES_COUNT))}`,
      description: getRandomArrayElement(CITIES).description
    }))
  };
}
