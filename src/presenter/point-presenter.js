import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';

import { remove, render, replace } from '../framework/render.js';

const POINT_MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {

  #mode = POINT_MODE.DEFAULT;

  #destinationsModel = null;
  #offersModel = null;
  #point = null;

  #pointChangeHandler = null;
  #modeChangeHandler = null;

  #eventListComponent = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #prevPointComponent = null;
  #prevPointEditComponent = null;

  constructor(destinationsModel, offersModel, eventListComponent, pointChangeHandler, modeChangeHandler) {
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventListComponent = eventListComponent;

    this.#pointChangeHandler = pointChangeHandler;
    this.#modeChangeHandler = modeChangeHandler;
  }

  #replaceFormToPoint = () => {
    this.#mode = POINT_MODE.DEFAULT;
    replace(this.#pointComponent, this.#pointEditComponent);
  };

  #replacePointToForm = () => {
    this.#modeChangeHandler();
    this.#mode = POINT_MODE.EDITING;
    replace(this.#pointEditComponent, this.#pointComponent);
  };

  #onSaveButtonSubmit = (update) => {
    const updatedPoint = {
      ...this.#point,
      ...update,
      type: update.type || this.#point.type,
      destination: update.destination || this.#point.destination,
      offers: update.offers || this.#point.offers
    };
    this.#pointChangeHandler('UPDATE_TASK', 'MINOR', updatedPoint);
  };

  #onRollupButtonClick = () => {
    this.#replacePointToForm();
  };

  #onResetButtonClick = () => {
    this.#replaceFormToPoint();
  };

  #onDeleteButtonClick = (point) => {
    this.#pointChangeHandler('DELETE_TASK', 'MINOR', point);
    this.#replaceFormToPoint();
  };

  #onFavoriteButtonClick = () => {
    this.#pointChangeHandler('UPDATE_TASK', 'MINOR', {
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  };

  #renderPoint = (point, destination, offers) => {
    this.#prevPointComponent = this.#pointComponent;
    this.#prevPointEditComponent = this.#pointEditComponent;

    if (!destination) {
      destination = this.#destinationsModel.getById(point.destination);
    }

    this.#pointComponent = new PointView(
      point,
      destination,
      offers,
      this.#onRollupButtonClick,
      this.#onFavoriteButtonClick
    );

    this.#pointEditComponent = new EditPointView({
      point,
      destination,
      offers,
      allOffers: this.#offersModel.get(),
      onSaveClick: this.#onSaveButtonSubmit,
      onRollUpClick: this.#onResetButtonClick,
      onDeleteClick: this.#onDeleteButtonClick
    });

    if (!(this.#prevPointComponent && this.#prevPointEditComponent)) {
      render(this.#pointComponent, this.#eventListComponent.element);
      return;
    }

    if (this.#mode === POINT_MODE.DEFAULT) {
      replace(this.#pointComponent, this.#prevPointComponent);
    }

    if (this.#mode === POINT_MODE.EDITING) {
      replace(this.#pointEditComponent, this.#prevPointEditComponent);
    }
  };

  init(point) {
    this.#point = point;
    const destination = this.#destinationsModel.getById(point.destination);
    const offers = this.#offersModel.getByType(point.type);

    if (!destination) {
      console.error(`Destination not found for point ${point.id}`);
      return;
    }

    this.#renderPoint(point, destination, offers);
  }

  resetView = () => {
    if (this.#mode !== POINT_MODE.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  removeComponent = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };
}
