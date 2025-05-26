const isFuture = (date) => new Date(date) > new Date();

const isPresent = (dateFrom, dateTo) => {
  const now = new Date();
  return new Date(dateFrom) <= now && new Date(dateTo) >= now;
};

const isPast = (date) => new Date(date) < new Date();

export {isFuture, isPresent, isPast};
