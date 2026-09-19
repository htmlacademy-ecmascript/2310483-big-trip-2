import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import DateServices from '../api/services/date-services.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { PRICE_INPUT_REGEXP } from '../api/constants.js';

const DateFormat = {
  FLATPICKR: 'd/m/y H:i'
};

const createPointEditorTemplate = (data) => {
  const {
    referenceData: {
      offersData,
      destinations
    },
    point
  } = data;
  const {
    id,
    type,
    dateFrom,
    dateTo,
    destinationId,
    basePrice,
    offersIds
  } = point;

  const {getFormDate} = new DateServices();
  const currentType = type ?? 'flight';
  const eventTypes = offersData.map((item) => item.type);
  const offersList = offersData.find((item) => item.type === type).offers;
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
                ${ eventTypes.map((t, index) => `<div class="event__type-item">
                  <input id="event-type-${t}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${t}">
                  <label class="event__type-label  event__type-label--${t}" for="event-type-${t}-${index}">${t}</label>
                </div>`).join('') }
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${currentType}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination?.name ?? ''}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${ destinations.map(({name}) => `<option value="${name}"></option>`).join('') }
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${dateFrom ? getFormDate(dateFrom) : ''}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${dateTo ? getFormDate(dateTo) : ''}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden"></span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice ?? ''}">
          </div>
          ${point.id ? `
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
                        <span class="event__offer-title">${offerOption.value}</span>
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
              ${currentDestination.pictures.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.alt}">`).join('')}
            </div>
            </div>
          </section>` : ''}
        </section>
      </form>
    </li>
  `;
};

export default class PointEditorView extends AbstractStatefulView {
  updatedData = {};
  #dateFromPicker = null;
  #dateToPicker = null;

  #onReset = null;
  #onRollupClick = null;
  #onSubmit = null;


  constructor(data) {
    super();
    this._state = {...data};
    this.updatedData = {...data.point};
    this.#setDatepickers();
    this.#handlerTypeChange();
    this.#handlerDestinationChange();
    this.#handleOffersChange();
    this.#handlePriceChange();
  }

  get template() {
    return createPointEditorTemplate(this._state);
  }

  removeElement() {
    this.#dateFromPicker?.destroy();
    this.#dateToPicker?.destroy();
    this.#dateFromPicker = null;
    this.#dateToPicker = null;
    super.removeElement();
  }

  _restoreHandlers() {
    this.#setDatepickers();
    this.#handlerTypeChange();
    this.#handlerDestinationChange();
    this.#handleOffersChange();
    this.#handlePriceChange();

    this.setResetClickHandler(this.#onReset);
    if (this._state.point.id) {
      this.setRollupClickHandler(this.#onRollupClick);
    }
    this.setSubmitClickHandler(this.#onSubmit);
  }

  #handlerTypeChange() {
    this.element.querySelector('.event__type-group').addEventListener('change', (evt) => {
      if (!evt.target.matches('.event__type-input')) {
        return;
      }
      this.updatedData = {...this._state.point, type: evt.target.value, offersIds: []};
      this.updateElement({...this._state, point: {...this.updatedData}});
    });
  }

  #handlerDestinationChange() {
    const input = this.element.querySelector('.event__input--destination');
    input.addEventListener('change', (evt) => {
      const destination = this._state.referenceData.destinations.find(({name}) => name === evt.target.value);
      if (!destination) {
        input.setCustomValidity('Use destionation from the list!');
        input.reportValidity();
        return;
      }
      this.updatedData.destinationId = destination.id;
      this.updateElement({...this._state, point: {...this.updatedData}});
    });
  }

  #handleOffersChange() {
    const updatedOffersIds = [...this.updatedData.offersIds];
    this.element.querySelectorAll('.event__offer-checkbox').forEach((checkbox) => checkbox.addEventListener('change', (evt) => {
      if (evt.target.checked) {
        updatedOffersIds.push(evt.target.id);
      } else {
        updatedOffersIds.splice(updatedOffersIds.indexOf(evt.target.id), 1);
      }
      this.updatedData.offersIds = updatedOffersIds;
    }));
  }

  #handlePriceChange() {
    const input = this.element.querySelector('.event__input--price');

    input.addEventListener('change', (evt) => {
      if (PRICE_INPUT_REGEXP.test(evt.target.value) === false) {
        input.setCustomValidity('Use only numbers!');
        input.reportValidity();
        return;
      }
      this.updatedData.basePrice = Number(evt.target.value);
    });
  }

  #setDatepickers() {
    const {point} = this._state;
    const startInput = this.element.querySelector(`#event-start-time-${point.id}`);
    const endInput = this.element.querySelector(`#event-end-time-${point.id}`);

    this.#dateFromPicker = flatpickr(startInput, {
      enableTime: true,
      dateFormat: DateFormat.FLATPICKR,
      defaultDate: this.updatedData.dateFrom,
      onChange: ([userDate]) => {
        this.updatedData.dateFrom = userDate;
      },
    });

    this.#dateToPicker = flatpickr(endInput, {
      enableTime: true,
      dateFormat: DateFormat.FLATPICKR,
      defaultDate: point.dateTo,
      minDate: this.updatedData.dateFrom,
      onChange: ([userDate]) => {
        if (!userDate) {
          return;
        }
        this.updatedData.dateTo = userDate;
      }
    });
  }

  setRollupClickHandler(callback) {
    this.#onRollupClick = () => callback();
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onRollupClick);
  }

  setSubmitClickHandler(callback) {
    this.#onSubmit = (evt) => callback(evt);
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#onSubmit);
  }

  setResetClickHandler(callback) {
    if (this._state.point.id) {
      this.#onReset = () => callback(this._state.point.id);
    } else {
      this.#onReset = () => callback();
    }
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onReset);
  }
}
