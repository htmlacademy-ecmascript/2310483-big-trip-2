import { createElement } from '../../render.js';

const offersTemplate = () => `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    </div>
  </section>
`;

export default class OffersView {
  getTemplate() {
    return offersTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
