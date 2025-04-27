import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';

import { MODE } from '../const.js';

import { render, replace } from '../framework/render.js';
import { onEscapeKeyDown, removeHandlerOnEscape } from '../utils/common.js';

export default class PointPresenter {

  #mode = MODE.DEFAULT;

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
    this.#mode = MODE.DEFAULT;

    replace(this.#pointComponent, this.#pointEditComponent);
    removeHandlerOnEscape(this.#onEscapeKeyDown);
  };

  #replacePointToForm = () => {
    this.#modeChangeHandler();

    this.#mode = MODE.EDIT;

    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscapeKeyDown);
  };

  #onEscapeKeyDown = (evt) => {
    onEscapeKeyDown(evt);

    this.#replaceFormToPoint();
  };

  #onSaveButtonSubmit = (evt) => {
    evt.preventDefault();

    this.#replaceFormToPoint(evt);
  };

  #onRollupButtonClick = () => {
    this.#replacePointToForm();
  };

  #onResetButtonClick = () => {
    this.#replaceFormToPoint();
  };

  #renderPoint = (point, destination, offers, pointChangeHandler) => {
    this.#prevPointComponent = this.#pointComponent;
    this.#prevPointEditComponent = this.#pointEditComponent;

    const onFavoriteButtonCLick = () => pointChangeHandler({...point, isFavorite: !point.isFavorite});

    this.#pointComponent = new PointView(
      point,
      destination,
      offers,
      this.#onRollupButtonClick,
      onFavoriteButtonCLick);

    this.#pointEditComponent = new EditPointView(
      point,
      destination,
      offers,
      this.#onResetButtonClick,
      this.#onSaveButtonSubmit);

    if (!(this.#prevPointComponent && this.#prevPointEditComponent)) {
      render(this.#pointComponent, this.#eventListComponent.element);

      return;
    }

    replace(this.#pointComponent, this.#prevPointComponent);
  };

  init(point) {
    this.#point = point;

    this.#renderPoint(
      this.#point,
      this.#destinationsModel.getById(this.#point.destination),
      this.#offersModel.getByType(this.#point.eventType),
      this.#pointChangeHandler);
  }

  resetView = () => {
    if (this.#mode === MODE.EDIT) {
      this.#onResetButtonClick();
    }
  };
}
