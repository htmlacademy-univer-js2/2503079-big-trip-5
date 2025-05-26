import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';

import { UpdateType, UserAction } from '../const.js';
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

  #pointDestination = null;
  #pointOffers = null;

  constructor(destinationsModel, offersModel, eventListComponent, pointChangeHandler, modeChangeHandler) {
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventListComponent = eventListComponent;

    this.#pointChangeHandler = pointChangeHandler;
    this.#modeChangeHandler = modeChangeHandler;
  }

  #replaceFormToPoint = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#mode = POINT_MODE.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    replace(this.#pointComponent, this.#pointEditComponent);
  };

  #replacePointToForm = () => {
    this.#modeChangeHandler();
    this.#mode = POINT_MODE.EDITING;
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #onSaveButtonSubmit = async (update) => {
    try {
      const updatedPoint = {
        ...this.#point,
        ...update,
        type: update.type || this.#point.type,
        destination: update.destination || this.#point.destination,
        offers: update.offers || this.#point.offers
      };
      await this.#pointChangeHandler(UserAction.UPDATE_POINT, UpdateType.MINOR, updatedPoint);
      this.#replaceFormToPoint();
    } catch (err) {
      this.#pointEditComponent.shake();
    }
  };

  #onRollupButtonClick = () => {
    this.#replacePointToForm();
  };

  #onResetButtonClick = () => {
    this.#replaceFormToPoint();
  };

  #onDeleteButtonClick = async (point) => {
    try {
      await this.#pointChangeHandler(UserAction.DELETE_POINT, UpdateType.MINOR, point);
      this.#replaceFormToPoint();
    } catch (err) {
      this.#pointEditComponent.shake();
    }
  };

  #onFavoriteButtonClick = async () => {
    try {
      await this.#pointChangeHandler(UserAction.UPDATE_POINT, UpdateType.MINOR, {
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      });
    } catch (err) {
      this.#pointEditComponent.shake();
    }
  };

  #renderPoint = () => {
    this.#prevPointComponent = this.#pointComponent;
    this.#prevPointEditComponent = this.#pointEditComponent;

    if (!this.#pointDestination) {
      this.#pointDestination = this.#destinationsModel.getById(this.#point.destination);
    }

    if (!this.#pointDestination) {
      return;
    }

    this.#pointComponent = new PointView(
      this.#point,
      this.#pointDestination,
      this.#pointOffers,
      this.#onRollupButtonClick,
      this.#onFavoriteButtonClick
    );

    this.#pointEditComponent = new EditPointView({
      point: this.#point,
      destination: this.#pointDestination,
      offers: this.#pointOffers,
      allOffers: this.#offersModel.get(),
      onSaveClick: this.#onSaveButtonSubmit,
      onRollUpClick: this.#onResetButtonClick,
      onDeleteClick: this.#onDeleteButtonClick,
      destinationsModel: this.#destinationsModel
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
    this.#pointDestination = this.#destinationsModel.getById(point.destination);
    const typeOffers = this.#offersModel.getByType(point.type);
    this.#pointOffers = typeOffers ? typeOffers.offers.filter((offer) => point.offers.includes(offer.id)) : [];

    this.#renderPoint();
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
