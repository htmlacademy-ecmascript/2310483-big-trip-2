import { createElement } from '../render.js';

/* const photosTapeTemplate = (photos) =>
  `<div class="event__photos-container">
    <div class="event__photos-tape">
    ${photos.map((photo) => `<img class="event__photo" src="${photo.url}" alt="${photo.alt}">`).join('')}
    </div>
  </div>`; */

const destionationTemplate = (currentDestination) => {
  const {description, pictures} = currentDestination;

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
      <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((photo) => `<img class="event__photo" src="${photo.url}" alt="${photo.alt}">`).join('')}
      </div>
      </div>
    </section>
  `;
};

export default class DestinationView {
  constructor(currentDestination) {
    this.currentDestination = currentDestination;
  }

  getTemplate() {
    return destionationTemplate(this.currentDestination);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
