import { isFuture, isPast, isPresent } from './date.js';

export const filter = {
  everything: (points) => points,
  future: (points) => points.filter((point) => isFuture(point.dateFrom)),
  present: (points) => points.filter((point) => isPresent(point.dateFrom, point.dateTo)),
  past: (points) => points.filter((point) => isPast(point.dateTo))
};
