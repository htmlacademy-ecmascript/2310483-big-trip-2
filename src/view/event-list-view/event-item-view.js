import AbstractView from '../../framework/view/abstract-view.js';
import DateServices from '../../api/services/date-services.js';

const createEventItemTemplate = ({point, destinations, offers}) => {
  const {type, destinationId, dateFrom, dateTo, basePrice, offersIds, isFavorite} = point;

  const {getISODate, getISODateTime, getMonthDay, getHoursMinutes, getDuration} = new DateServices();
  const selectedOffers = offers.filter((offer) => offersIds.includes(offer.id));
  const destination = destinations.find((item) => item.id === destinationId).name;

  const offersList = offers.length > 0 ? `
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${selectedOffers.map((offer) => `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`).join('')}
    </ul>
  ` : '';

  return (`<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${getISODate(dateFrom)}" }">${getMonthDay(dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${getISODateTime(dateFrom)}">${getHoursMinutes(dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${getISODateTime(dateTo)}">${getHoursMinutes(dateTo)}</time>
        </p>
        <p class="event__duration">${getDuration(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      ${offersList}
      <button class="event__favorite-btn ${isFavorite ? '' : 'event__favorite-btn--active'}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`);
};

export default class EventItemView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;

  constructor({point, destinations, offers}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createEventItemTemplate({point: this.#point, destinations: this.#destinations, offers: this.#offers});
  }

  get point() {
    return this.#point;
  }

  setRollupClickHandler(callback) {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', callback);
  }

  setFavoriteClickHandler(callback) {
    this.element.querySelector('.event__favorite-btn').addEventListener('click', callback);
  }
}
