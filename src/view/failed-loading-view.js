import AbstractView from '../framework/view/abstract-view';


const createFailedLoadingTemplate = () => (`
  <p class="trip-events__msg">Failed to load latest route information</p>
`);

export default class FailedLoadingView extends AbstractView {
  get template() {
    return createFailedLoadingTemplate();
  }
}
