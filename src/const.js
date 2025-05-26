export const DateFormat = {
  LONG: 'YYYY-MM-DDTHH:mm',
  SHORT: 'MMM DD',
  TIME: 'HH:mm'
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const MS_IN_DAY = 86400000;
const MS_IN_HOUR = 3600000;

export const TYPE_POINTS = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export const Sorts = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

export const FilterMessages = {
  everything: 'Click New Event to create your first point',
  future: 'There are no future events now',
  present: 'There are no present events now',
  past: 'There are no past events now'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const VALIDATION_ERRORS = {
  INVALID_DESTINATION: 'Please select a valid destination from the list',
  INVALID_PRICE: 'Please enter a valid positive number',
  PRICE_EXCEEDS_LIMIT: 'Price must not exceed 100,000',
  DATE_ORDER: 'End date must be after start date'
};

export {
  FilterType,
  UserAction,
  VALIDATION_ERRORS,
  MS_IN_DAY,
  MS_IN_HOUR,
};
