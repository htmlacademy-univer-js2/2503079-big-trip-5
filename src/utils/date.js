export const isFuture = (date) => new Date(date) > new Date();

export const isPresent = (dateFrom, dateTo) => {
  const now = new Date();
  return new Date(dateFrom) <= now && new Date(dateTo) >= now;
};

export const isPast = (date) => new Date(date) < new Date();
