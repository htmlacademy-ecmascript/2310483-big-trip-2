import AbstractView from '../framework/view/abstract-view.js';

const createModalPointTemplate = (data) => {
  const {eventTypes, currentType, destinationsList, currentDestination, offersList} = data;

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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="" list="destination-list-1">
            <datalist id="destination-list-1">
              ${ destinationsList.map(({name}) => `<option value="${name}"></option>`).join('') }
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden"></span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          ${offersList && `<section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                ${(offersList.map((offerOption) => `<div class="event__offer-selector">
                      <input class="event__offer-checkbox  visually-hidden" id="${offerOption.id}" type="checkbox" name="${offerOption.value}">
                      <label class="event__offer-label" for="${offerOption.id}">
                        <span class="event__offer-title">${offerOption.title}</span>
                        &plus;&euro;&nbsp;
                        <span class="event__offer-price">${offerOption.price}</span>
                      </label>
                  </div>`))}
              </div>
            </section>`}
          ${currentDestination && `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${currentDestination.description}</p>
            <div class="event__photos-container">
            <div class="event__photos-tape">
              ${currentDestination.pictures.map((photo) => `<img class="event__photo" src="${photo.url}" alt="${photo.alt}">`).join('')}
            </div>
            </div>
          </section>`}
        </section>
      </form>
    </li>
  `;
};

export default class ModalPointView extends AbstractView {
  #data = null;

  constructor(data) {
    super();
    this.#data = data;
  }

  get template() {
    return createModalPointTemplate(this.#data);
  }
}
