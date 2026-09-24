import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import DateService from '../api/services/date-service.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { EMPTY_DESTINATION, PRICE_INPUT_REGEXP } from '../api/constants.js';

const DateFormat = {
  FLATPICKR: 'd/m/y H:i'
};

const createPointEditorTemplate = (data) => {
  const {
    referenceData: {
      offersData,
      destinations
    },
    point,
    isSaving,
    isDeleting,
    isDisabled
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

  const {getFormDate} = new DateService();
  const currentType = type ?? 'flight';
  const eventTypes = offersData.map((item) => item.type);
  const offersList = offersData.find((item) => item.type === type).offers ?? [];
  const currentDestination = destinations.find((item) => item.id === destinationId) ?? EMPTY_DESTINATION;

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
            </label>
            <input
              class="event__type-toggle  visually-hidden"
              id="event-type-toggle-1"
              type="checkbox"
              ${isDisabled ? 'disabled' : ''}
            >
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
            <input
              class="event__input  event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${currentDestination?.name ?? ''}"
              list="destination-list-1"
              ${isDisabled ? 'disabled' : ''}
            >
            <datalist id="destination-list-1">
              ${ destinations.map(({name}) => `<option value="${name}"></option>`).join('') }
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input
            class="event__input  event__input--time"
            id="event-start-time-${id}"
            type="text"
            name="event-start-time"
            value="${dateFrom ? getFormDate(dateFrom) : ''}"
            ${isDisabled ? 'disabled' : ''}
          >
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input
            class="event__input  event__input--time"
            id="event-end-time-${id}"
            type="text"
            name="event-end-time"
            value="${dateTo ? getFormDate(dateTo) : ''}"
            ${isDisabled ? 'disabled' : ''}
          >
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden"></span>
              &euro;
            </label>
            <input
            class="event__input  event__input--price"
            id="event-price-1"
            type="text"
            name="event-price"
            value="${basePrice ?? ''}"
            ${isDisabled ? 'disabled' : ''}
          >
          </div>
          ${point.id ? `
              <button
                class="event__save-btn  btn  btn--blue"
                type="submit"
                ${isDisabled ? 'disabled' : ''}
              >
                ${isSaving === true ? 'Saving...' : 'Save'}
              </button>
              <button
                class="event__reset-btn"
                type="reset"
                ${isDisabled ? 'disabled' : ''}
              >
                ${isDeleting === true ? 'Deleting...' : 'Delete'}
              </button>
              <button
                class="event__rollup-btn"
                type="button"
                ${isDisabled ? 'disabled' : ''}
              >
                <span class="visually-hidden">Open event</span>
              </button>
              ` : `
              <button
                class="event__save-btn  btn  btn--blue"
                type="submit"
                ${isDisabled ? 'disabled' : ''}
              >
                ${isSaving === true ? 'Saving...' : 'Save'}
              </button>
              <button
                class="event__reset-btn"
                type="reset"
                ${isDisabled ? 'disabled' : ''}
              >
                Cancel
              </button>
            `}
        </header>
        <section class="event__details">
          ${offersList.length > 0 ? `<section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                ${(offersList.map((offerOption) => `<div class="event__offer-selector">
                      <input
                        class="event__offer-checkbox  visually-hidden"
                        id="${offerOption.id}"
                        type="checkbox"
                        name="${offerOption.value}"
                        ${offersIds.includes(offerOption.id) ? 'checked' : ''}
                        ${isDisabled ? 'disabled' : ''}
                      >
                      <label class="event__offer-label" for="${offerOption.id}">
                        <span class="event__offer-title">${offerOption.value}</span>
                        &plus;&euro;&nbsp;
                        <span class="event__offer-price">${offerOption.price}</span>
                      </label>
                  </div>`))}
              </div>
            </section>` : ''}
          ${currentDestination.description.length > 0 ? `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${currentDestination.description}</p>
            ${currentDestination.pictures.length > 0 && `<div class="event__photos-container">
              <div class="event__photos-tape">
                ${currentDestination.pictures.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.alt}">`).join('')}
              </div>
            </div>`}
          </section>` : ''}
        </section>
      </form>
    </li>
  `;
};

export default class PointEditorView extends AbstractStatefulView {
  #dateFromPicker = null;
  #dateToPicker = null;

  #resetHandler = null;
  #rollupHandler = null;
  #submitHandler = null;


  constructor(data) {
    super();
    this.#parseDataToState(data);
    this.#setDatepickers();
    this.#typeChangeHandler();
    this.#destinationChangeHandler();
    this.#offersChangeHandler();
    this.#priceChangeHandler();
  }

  get template() {
    return createPointEditorTemplate(this._state);
  }

  get point() {
    return this._state.point;
  }

  setRollupClickHandler(callback) {
    this.#rollupHandler = () => callback();
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupHandler);
  }

  setSubmitClickHandler(callback) {
    this.#submitHandler = (evt) => callback(evt);
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#submitHandler);
  }

  setResetClickHandler(callback) {
    if (this._state.point.id) {
      this.#resetHandler = () => callback(this._state.point.id);
    } else {
      this.#resetHandler = () => callback();
    }
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#resetHandler);
  }

  #setDatepickers() {
    const {point} = this._state;
    const startInput = this.element.querySelector(`#event-start-time-${point.id}`);
    const endInput = this.element.querySelector(`#event-end-time-${point.id}`);

    this.#dateFromPicker = flatpickr(startInput, {
      enableTime: true,
      dateFormat: DateFormat.FLATPICKR,
      defaultDate: point.dateFrom,
      onChange: ([userDate]) => {
        this._state.point.dateFrom = userDate;
      },
    });

    this.#dateToPicker = flatpickr(endInput, {
      enableTime: true,
      dateFormat: DateFormat.FLATPICKR,
      defaultDate: point.dateTo,
      minDate: point.dateFrom,
      onChange: ([userDate]) => {
        if (!userDate) {
          return;
        }
        this._state.point.dateTo = userDate;
      }
    });
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
    this.#typeChangeHandler();
    this.#destinationChangeHandler();
    this.#offersChangeHandler();
    this.#priceChangeHandler();

    this.setResetClickHandler(this.#resetHandler);
    if (this._state.point.id) {
      this.setRollupClickHandler(this.#rollupHandler);
    }
    this.setSubmitClickHandler(this.#submitHandler);
  }

  #parseDataToState(data) {
    this._state = {
      point: {...data.point},
      referenceData: data.referenceData,
      isSaving: false,
      isDeleting: false,
      isDisabled: false
    };
  }

  #typeChangeHandler() {
    this.element.querySelector('.event__type-group').addEventListener('change', (evt) => {
      if (!evt.target.matches('.event__type-input')) {
        return;
      }
      this._state.point = {...this._state.point, type: evt.target.value, offersIds: []};
      this.updateElement({...this._state});
    });
  }

  #destinationChangeHandler() {
    const input = this.element.querySelector('.event__input--destination');
    input.addEventListener('change', (evt) => {
      const destination = this._state.referenceData.destinations.find(({name}) => name === evt.target.value) ?? null;
      if (!destination) {
        input.setCustomValidity('Use destination from the list!');
        input.reportValidity();
        this._state.point.destinationId = null;
        this.updateElement({...this._state});
        return;
      }

      this._state.point.destinationId = destination.id;
      this.updateElement({...this._state});
    });
  }

  #offersChangeHandler() {
    const updatedOffersIds = [...this._state.point.offersIds];
    this.element.querySelectorAll('.event__offer-checkbox').forEach((checkbox) => checkbox.addEventListener('change', (evt) => {
      if (evt.target.checked) {
        updatedOffersIds.push(evt.target.id);
      } else {
        updatedOffersIds.splice(updatedOffersIds.indexOf(evt.target.id), 1);
      }
      this._state.point.offersIds = updatedOffersIds;
    }));
  }

  #priceChangeHandler() {
    const input = this.element.querySelector('.event__input--price');

    input.addEventListener('change', (evt) => {
      if (PRICE_INPUT_REGEXP.test(evt.target.value) === false) {
        input.setCustomValidity('Use only numbers!');
        input.reportValidity();
        return;
      }
      this._state.point.basePrice = Number(evt.target.value);
    });
  }
}
