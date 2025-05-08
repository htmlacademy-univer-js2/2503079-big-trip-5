import { RenderPosition, remove, render } from '../framework/render.js';
import { getDefaultPoint } from '../mock/point.js';
import EditPointView from '../view/edit-point-view.js';

export default class NewPointPresenter {
  #container = null;
  #newPointComponent = null;
  #handleDataChange = null;
  #addPointButton = null;
  #destinationsModel = null;
  #offersModel = null;

  constructor({ container, onDataChange, addPointButton, destinationsModel, offersModel }) {
    this.#container = container;
    this.#handleDataChange = onDataChange;
    this.#addPointButton = addPointButton;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    if (this.#newPointComponent !== null) {
      return;
    }

    const destinations = this.#destinationsModel.destinations;
    if (!destinations || destinations.length === 0) {
      console.error('No destinations available');
      return;
    }

    const defaultPoint = getDefaultPoint();
    defaultPoint.destination = destinations[0].id;

    const defaultDestination = this.#destinationsModel.getById(defaultPoint.destination);
    if (!defaultDestination) {
      console.error('Default destination not found');
      return;
    }

    const defaultOffers = this.#offersModel.getByType(defaultPoint.type) || [];

    this.#newPointComponent = new EditPointView({
      point: defaultPoint,
      destination: defaultDestination,
      offers: defaultOffers,
      allOffers: this.#offersModel.offers,
      onSaveClick: this.#handleEditPointSave,
      onDeleteClick: this.#handleEditCancelPoint,
      onRollUpClick: this.#handleEditCancelPoint,
      destinationsModel: this.#destinationsModel
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

  #handleEditPointSave = (point) => {
    this.#handleDataChange('add', point);
    this.destroy();
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
