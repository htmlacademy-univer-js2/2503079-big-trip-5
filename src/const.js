import { getRandomValue } from './utils/common';

export const DateFormat = {
  LONG: 'YYYY-MM-DDTHH:mm',
  SHORT: 'MMM DD',
  TIME: 'HH:mm'
};

const MS_IN_DAY = 86400000;

const MS_IN_HOUR = 3600000;

const TYPE_POINTS = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

const FILTERS = ['Everything', 'Future', 'Present', 'Past'];
const SORTS = ['Day', 'Event', 'Time', 'Price', 'Offers'];
const FilterMessages = {
  'Everything': 'Click New Event to create your first point',
  'Future': 'There are no future events now',
  'Present': 'There are no present events now',
  'Past': 'There are no past events now'
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

const CITIES = [
  {
    name: 'Chamonix',
    description: 'Chamonix is situated in the French Alps just north of Mont Blanc, the highest mountain in Western Europe. Between the peaks of the Aiguilles Rouges and the notable Aiguille du Midi, it borders both Switzerland and Italy. It is one of the oldest ski resorts in France, popular with alpinists and mountain enthusiasts.'
  },
  {
    name: 'Geneva',
    description: 'Geneva is a French–speaking name in the south-west of Switzerland, the center of the canton of the same name, combining the peaceful tranquility of an elite holiday and the turbulent passions of political life. Tourists come here who appreciate cleanliness, peace, perfect service and do not pay attention to prices.'
  },
  {
    name: 'Amsterdam',
    description: 'Amsterdam, capital of the Netherlands! These days the name has a population of just over 790.000 inhabitants and is the largest name in the country. Amsterdam is located in the province ‘Noord-Holland’, situated in the west. It is one of the most popular destinations in Europe, receiving more than 4.5 million tourists annually.'
  },
  {
    name: 'Moscow',
    description: 'Moscow is the capital of Russia, with striking architecture that ranges from grand palaces and cathedrals to unique museums and Russian Baroque skyscrapers. St. Basil’s Cathedral and the Kremlin are iconic landmarks, along with the top-secret nuclear hideout Bunker 42 and elegant Metro stations decorated with chandeliers, statues, and dazzling mosaics.'
  },
  {
    name: 'New York',
    description: 'New York City, name and port located at the mouth of the Hudson River, southeastern New York state, northeastern U.S. It is the largest and most influential American metropolis, encompassing Manhattan and Staten islands, the western sections of Long Island, and a small portion of the New York state mainland to the north of Manhattan.'
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

export { CITIES, DATES, DESCRIPTIONS, FilterMessages, FILTERS, IMAGES, MODE, MS_IN_DAY, MS_IN_HOUR, OFFERS, PRICES, SORTS, TYPE_POINTS };

