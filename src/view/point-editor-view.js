import AbstractView from '../framework/view/abstract-view.js';
import DateServices from '../api/services/date-services.js';


const createPointEditorTemplate = (data) => {
  const {
    referenceData: {
      offersData,
      destinations
    },
    point
  } = data;
  const {
    type,
    dateFrom,
    dateTo,
    destinationId,
    basePrice,
    isFavorite,
    offersIds
  } = point;
  const {getDateTime} = new DateServices();
  const currentType = type ?? 'flight';
  const eventTypes = offersData.map((offer) => offer.type);
  const offersList = offersData.find((offer) => offer.type === currentType).offers;
  const currentDestination = destinations.find((item) => item.id === destinationId);

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${ eventTypes.map((type, index) => `<div class="event__type-item">
                  <input id="event-type-${type}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
                  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${index}">${type}</label>
                </div>`).join('') }
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${currentType}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${ destinations.map(({name}) => `<option value="${name}"></option>`).join('') }
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateTime(dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateTime(dateTo)}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden"></span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice ?? ''}">
          </div>
          ${point ? `
              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Delete</button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
              ` : `
              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Cancel</button>
            `}
        </header>
        <section class="event__details">
          ${offersList && `<section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                ${(offersList.map((offerOption) => `<div class="event__offer-selector">
                      <input class="event__offer-checkbox  visually-hidden" id="${offerOption.id}" type="checkbox" name="${offerOption.value}" ${offersIds.includes(offerOption.id) ? 'checked' : ''}>
                      <label class="event__offer-label" for="${offerOption.id}">
                        <span class="event__offer-title">${offerOption.title}</span>
                        &plus;&euro;&nbsp;
                        <span class="event__offer-price">${offerOption.price}</span>
                      </label>
                  </div>`))}
              </div>
            </section>`}
          ${currentDestination ? `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${currentDestination.description}</p>
            <div class="event__photos-container">
            <div class="event__photos-tape">
              ${currentDestination.pictures.map((photo) => `<img class="event__photo" src="${photo.url}" alt="${photo.alt}">`).join('')}
            </div>
            </div>
          </section>` : ''}
        </section>
      </form>
    </li>
  `;
};

export default class PointEditorView extends AbstractView {
  #data = null;

  constructor(data) {
    super();
    this.#data = data;
  }

  get template() {
    return createPointEditorTemplate(this.#data);
  }

  setRollupClickHandler(callback) {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', callback);
  }

  setSubmitClickHandler(callback) {
    this.element.querySelector('.event__save-btn').addEventListener('click', callback);
  }

  setDeleteClickHandler(callback) {
    this.element.querySelector('.event__reset-btn').addEventListener('click', callback);
  }
}
