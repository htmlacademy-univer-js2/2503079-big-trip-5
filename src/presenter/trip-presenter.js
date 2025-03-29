import { render, replace } from '../framework/render.js';
import { generateFilters } from '../mock/filter.js';
import EditPointView from '../view/edit-point-view.js';
import EmptyPointsListMessageView from '../view/empty-points-list-view.js';
import FilterView from '../view/filter-view.js';
import PointView from '../view/point-view.js';
import PointListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';

export default class Presenter {
  #pointsListComponent = new PointListView();
  #filtersContainer = null;
  #tripEventsContainer = null;
  #pointsModel = null;
  #points = null;
  #filters = null;

  constructor({filtersContainer, tripEventsContainer, pointsModel}) {
    this.#filtersContainer = filtersContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = this.#pointsModel.points;
    this.#filters = generateFilters(this.#points);

    render(new FilterView({filters: this.#filters}), this.#filtersContainer);
    render(new SortView(), this.#tripEventsContainer);
    render(this.#pointsListComponent, this.#tripEventsContainer);

    if (this.#points.length > 0) {
      this.#points.forEach((point) => this.#renderPoint(point));
    } else {
      render(new EmptyPointsListMessageView(), this.#pointsListComponent.element);
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

    render(pointItem, this.#pointsListComponent.element);
  }
}
