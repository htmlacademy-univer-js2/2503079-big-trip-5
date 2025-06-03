const removeHandlerOnEscape = (cb) => document.removeEventListener('keydown', cb);

const onEscapeKeyDown = (evt) => {
  if (evt.key === 'Escape') {
    removeHandlerOnEscape(onEscapeKeyDown);
  }
};

function adaptToClient(point) {
  const adaptedPoint = {
    ...point,
    price: point.base_price,
    dateFrom: point.date_from !== null ? new Date(point.date_from) : point.date_from,
    dateTo: point.date_to !== null ? new Date(point.date_to) : point.date_to,
    isFavorite: point.is_favorite
  };

  delete adaptedPoint.base_price;
  delete adaptedPoint.date_from;
  delete adaptedPoint.date_to;
  delete adaptedPoint.is_favorite;

  return adaptedPoint;
}

function updatePoints(points, update) {
  return points.map((point) => point.id === update.id ? update : point);
}

function formatDateForServer(date) {
  if (date instanceof Date) {
    return date.toISOString();
  }
  if (typeof date === 'string') {
    return date;
  }
  return null;
}

function isEscapeKey(evt) {
  return evt.key === 'Escape';
}

function adaptToServer(point, isNew = false) {
  const adaptedPoint = {
    type: point.type,
    destination: point.destination,
    ['base_price']: Number(point.basePrice || point.price),
    ['date_from']: formatDateForServer(point.dateFrom),
    ['date_to']: formatDateForServer(point.dateTo),
    ['is_favorite']: Boolean(point.isFavorite),
    offers: Array.isArray(point.offers) ? point.offers : []
  };

  if (!isNew && point.id) {
    adaptedPoint.id = point.id;
  }

  Object.keys(adaptedPoint).forEach((key) => {
    if (adaptedPoint[key] === undefined || adaptedPoint[key] === null) {
      delete adaptedPoint[key];
    }
  });

  return adaptedPoint;
}

export {
  isEscapeKey,
  removeHandlerOnEscape,
  onEscapeKeyDown,
  adaptToClient,
  updatePoints,
  adaptToServer
};
