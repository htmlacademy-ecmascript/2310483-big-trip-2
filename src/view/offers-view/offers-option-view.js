import {createElement} from '../../render.js';

const createOffersOptionTemplate = (offerOption) =>
  `
    <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${offerOption.id}" type="checkbox" name="${offerOption.value}">
        <label class="event__offer-label" for="${offerOption.id}">
          <span class="event__offer-title">${offerOption.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offerOption.price}</span>
        </label>
    </div>
  `;

export default class OffersOptionView {
  constructor(offerData) {
    this.offerData = offerData;
    this.element = null;
  }

  getTemplate() {
    return createOffersOptionTemplate(this.offerData);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
