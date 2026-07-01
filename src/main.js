import Presenter from './presenter/presenter.js';

const containers = {
  filters: document.querySelector('.trip-controls__filters'),
  main: document.querySelector('.trip-events'),
};

const presenter = new Presenter(containers);
presenter.init();
