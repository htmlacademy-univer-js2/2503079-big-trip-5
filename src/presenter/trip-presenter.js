import { render, replace } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import PointListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';

export default class Presenter {
  #listComponent = new PointListView();
  #sortingComponent = new SortView();

  #tripEventsContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #tripPoints = [];

  constructor({
    tripEventsContainer,
    pointsModel,
    offersModel,
    destinationsModel
  }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#tripPoints = this.#tripPoints = this.#pointsModel.points;
  }

  init() {
    render(this.#sortingComponent, this.#tripEventsContainer);
    render(this.#listComponent, this.#tripEventsContainer);

    for (let i = 1; i < this.#tripPoints.length; i++) {
      this.#renderPoint(this.#tripPoints[i]);
    }
  }

  #renderPoint(point) {
    const onEscKeydown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeydown);
      }
    };

    const editForm = new EditPointView({point,
      onSubmitClick: () => {
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeydown);
      },
      onRollButtonClick: () => {
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeydown);
      }
    });

    const pointItem = new PointView({point,
      onRollButtonClick: () => {
        replacePointToEditForm();
        document.addEventListener('keydown', onEscKeydown);
      }
    });

    function replacePointToEditForm() {
      replace(editForm, pointItem);
    }

    function replaceEditFormToPoint() {
      replace(pointItem, editForm);
    }

    render(pointItem, this.#listComponent.element);
  }
}
