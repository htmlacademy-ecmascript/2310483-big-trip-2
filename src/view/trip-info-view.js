import AbstractView from '../framework/view/abstract-view.js';
import DateService from '../api/services/date-service.js';

const MAX_CITIES_LENGTH = 3;

const createTripInfoTemplate = ({ cities, dates, price }) => {
  const { getInfoDate, isOneDayTrip } = new DateService();
  const getCitiesRow = () => {
    if (cities.length > MAX_CITIES_LENGTH) {
      return `${cities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}`;
    }

    return cities.join(' &mdash; ');
  };

  const getDatesRow = () => {
    if (isOneDayTrip(dates)) {
      return `${getInfoDate(dates.start)}`;
    }

    return getInfoDate(dates);
  };

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getCitiesRow()}</h1>
        <p class="trip-info__dates">${getDatesRow()}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
      </p>
    </section>
  `;
};

export default class TripInfoView extends AbstractView {
  #data = null;

  constructor(data) {
    super();
    this.#data = data;
  }

  get template() {
    return createTripInfoTemplate(this.#data);
  }
}
