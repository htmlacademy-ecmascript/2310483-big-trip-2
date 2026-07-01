import { createElement } from '../render.js';

/* const photosTapeTemplate = (photos) =>
  `<div class="event__photos-container">
    <div class="event__photos-tape">
    ${photos.map((photo) => `<img class="event__photo" src="${photo.url}" alt="${photo.alt}">`).join('')}
    </div>
  </div>`; */

const destionationTemplate = () => `
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.</p>
    <div class="event__photos-container">
    <div class="event__photos-tape">
        <img class="event__photo" src="img/photos/1.jpg" alt="Event photo">
        <img class="event__photo" src="img/photos/2.jpg" alt="Event photo">
        <img class="event__photo" src="img/photos/3.jpg" alt="Event photo">
        <img class="event__photo" src="img/photos/4.jpg" alt="Event photo">
        <img class="event__photo" src="img/photos/5.jpg" alt="Event photo">
      </div>
    </div>
  </section>
`;

export default class DestinationView {
  getTemplate() {
    return destionationTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
