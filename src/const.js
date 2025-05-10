import { getRandomValue } from './utils/common';

export const DateFormat = {
  LONG: 'YYYY-MM-DDTHH:mm',
  SHORT: 'MMM DD',
  TIME: 'HH:mm'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const MS_IN_DAY = 86400000;

const MS_IN_HOUR = 3600000;

const TYPE_POINTS = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

const FILTERS = [
  {
    type: 'everything',
    name: 'Everything'
  },
  {
    type: 'future',
    name: 'Future'
  },
  {
    type: 'present',
    name: 'Present'
  },
  {
    type: 'past',
    name: 'Past'
  }
];

export const Sorts = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const FilterMessages = {
  everything: 'Click New Event to create your first point',
  future: 'There are no future events now',
  present: 'There are no present events now',
  past: 'There are no past events now'
};

const PRICES = [90, 20, 80, 140, 100, 40, 110, 70, 130, 50];

const OFFERS = [
  { title: 'Order Uber', price: 40 },
  { title: 'Add luggage', price: 90 },
  { title: 'Switch to comfort', price: 35 },
  { title: 'Rent a car', price: 100 },
  { title: 'Add breakfast', price: 120 },
  { title: 'Book tickets', price: 40 },
  { title: 'Lunch in name', price: 150 }
];

const DATES = [
  {
    from: '2024-03-18T10:30',
    to: '2024-03-18T16:00'
  },
  {
    from: '2024-03-18T16:20',
    to: '2024-03-18T17:00'
  },
  {
    from: '2024-03-19T14:20',
    to: '2024-03-19T15:00'
  },
  {
    from: '2024-03-19T16:00',
    to: '2024-03-19T17:00'
  },
  {
    from: '2024-03-19T18:00',
    to: '2024-03-19T19:00'
  }
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt architecto labore atque!',
  'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem exercitationem culpa, molestias qui eveniet corrupti?',
  'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eius, dolorem.',
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit ad eaque cupiditate praesentium maxime.',
];

const IMAGE_URL = 'https://picsum.photos/536/354?random=';
const IMAGES = [];

for (let i = 0; i < 5; i++) {
  IMAGES.push(`${IMAGE_URL}${getRandomValue()}`);
}

const MODE = {
  DEFAULT: 'default',
  EDIT: 'edit'
};

export { DATES, DESCRIPTIONS, FilterMessages, FILTERS, FilterType, IMAGES, MODE, MS_IN_DAY, MS_IN_HOUR, OFFERS, PRICES, TYPE_POINTS };
