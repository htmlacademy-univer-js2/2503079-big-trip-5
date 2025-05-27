import { UpdateType, UserAction, POINT_MODE } from '../const.js';
import { RenderPosition, remove, render } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import {getDefaultPoint} from '../utils/point';

export default class NewPointPresenter {
  #container = null;
  #newPointComponent = null;
  #handleDataChange = null;
  #addPointButton = null;
  #destinationsModel = null;
  #offersModel = null;
  #mode = null;

  constructor({ container, onDataChange, addPointButton, destinationsModel, offersModel }) {
    this.#container = container;
    this.#handleDataChange = onDataChange;
    this.#addPointButton = addPointButton;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#mode = POINT_MODE.CREATING;
  }

  init() {
    if (this.#newPointComponent !== null) {
      return;
    }

    this.#addPointButton.disabled = true;

    const destinations = this.#destinationsModel.destinations;
    if (!destinations || destinations.length === 0) {
      return;
    }

    const defaultPoint = getDefaultPoint();
    const defaultOffers = this.#offersModel.getByType(defaultPoint.type) || [];

    this.#newPointComponent = new EditPointView({
      point: defaultPoint,
      destination: defaultPoint.destination,
      offers: defaultOffers,
      allOffers: this.#offersModel.offers,
      onSaveClick: this.#handleEditPointSave,
      onDeleteClick: this.#handleEditCancelPoint,
      onRollUpClick: this.#handleEditCancelPoint,
      destinationsModel: this.#destinationsModel,
      mode: this.#mode,
    });

    render(this.#newPointComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#newPointComponent === null) {
      return;
    }

    remove(this.#newPointComponent);
    this.#newPointComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#addPointButton.disabled = false;
  }

  #handleEditPointSave = async (point) => {
    try {
      await this.#handleDataChange(UserAction.ADD_POINT, UpdateType.MAJOR, point);
      this.destroy();
    } catch (err) {
      this.#newPointComponent.shake();
    }
  };

  #handleEditCancelPoint = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
