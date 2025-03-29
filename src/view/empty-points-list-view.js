import AbstractView from '../framework/view/abstract-view.js';

const createEmptyPointsListMessageTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

export default class PointListView extends AbstractView {
  get template() {
    return createEmptyPointsListMessageTemplate();
  }
}
