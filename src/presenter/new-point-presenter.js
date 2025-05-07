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

    const defaultPoint = getDefaultPoint();
    const defaultDestination = this.#destinationsModel.getById(defaultPoint.destination);
    const defaultOffers = this.#offersModel.getByType(defaultPoint.type);

    this.#newPointComponent = new EditPointView({
      point: defaultPoint,
      destination: defaultDestination,
      offers: defaultOffers,
      allOffers: this.#offersModel.get(),
      onSaveClick: this.#handleEditPointSave,
      onDeleteClick: this.#handleEditCancelPoint,
      onRollUpClick: null
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

  #handleEditPointSave = (updatedPoint) => {
    this.#handleDataChange('ADD_TASK', 'MAJOR', updatedPoint);
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
