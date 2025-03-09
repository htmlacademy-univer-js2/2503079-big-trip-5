import { render } from '../render';
import PointEditorView from '../view/editable-point-view';
import EventListView from '../view/events-list-view';
import PointView from '../view/point-view';
import SortView from '../view/sort-view';

export default class TripPresenter {
  listComponent = new EventListView();
  sortingComponent = new SortView();

  constructor({
    tripEventsContainer,
    pointsModel,
    offersModel,
    destinationsModel
  }) {
    this.tripEventsContainer = tripEventsContainer;
    this.pointsModel = pointsModel;
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
  }

  init() {
    this.tripPoints = [...this.pointsModel.getPoints()];

    render(this.sortingComponent, this.tripEventsContainer);
    render(this.listComponent, this.tripEventsContainer);

    if (this.tripPoints[0]) {
      render(new PointEditorView({ point: this.tripPoints[0] }), this.listComponent.getElement());
    }

    for (let i = 1; i < this.tripPoints.length; i++) {
      const point = this.tripPoints[i];
      const offers = this.offersModel.getOfferByType(point.type);
      const destination = this.destinationsModel.getDestinationById(point.destination.id);
      render(new PointView({ point, offers, destination }), this.listComponent.getElement());
    }
  }
}
