import { getMockDestination } from '../mock/destination.js';

export default class DestinationsModel {
  destinations = getMockDestination();

  getDestinations(){
    return this.destinations;
  }

  getDestinationById(id){
    for (let i = 0; i < this.destinations.length; i++) {
      if (this.destinations[i].id === id) {
        return this.destinations[i];
      }
    }
    return null;
  }
}
