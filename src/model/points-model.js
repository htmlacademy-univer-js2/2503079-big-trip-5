import { UpdateType } from '../const';
import Observable from '../framework/observable';
import { adaptToClient, updatePoints } from '../utils/common';

export default class PointsModel extends Observable{
  #pointsApiService = null;
  #points = [];
  #destinationsModel = null;
  #offersModel = null;
  constructor({pointsApiService, destinationsModel, offersModel}) {
    super();
    this.#pointsApiService = pointsApiService;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get points() {
    return this.#points;
  }

  async init() {
    try {
      console.log('PointsModel: Starting initialization');
      const points = await this.#pointsApiService.points;
      console.log('PointsModel: Raw points from API:', points);
      this.#points = points.map(adaptToClient);
      console.log('PointsModel: Adapted points:', this.#points);
      this._notify(UpdateType.INIT, {isError: false});
    } catch (err) {
      console.error('PointsModel: Error during initialization:', err);
      this.#points = [];
      this._notify(UpdateType.INIT, {isError: true});
    }
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update non-existing point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = adaptToClient(response);
      this.#points = updatePoints(this.#points, updatedPoint);
      this._notify(updateType, updatedPoint);
    } catch (err) {
      console.error('Failed to update point:', err);
      throw new Error('Can\'t update point');
    }
  }

  addPoint(updateType, updatedPoint) {
    this.#points = [
      updatedPoint,
      ...this.#points,
    ];

    this._notify(updateType, updatedPoint);
  }

  deletePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType);
  }
}
