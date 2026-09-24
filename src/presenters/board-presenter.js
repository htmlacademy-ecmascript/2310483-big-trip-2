import EventListView from '../view/event-list-view/event-list-view.js';
import EmptyListView from '../view/event-list-view/empty-list-view.js';
import SortView from '../view/sort-view.js';
import PointEditorView from '../view/editor-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {
  SortOptions,
  DEFAULT_SORT_OPTION,
  DEFAULT_FILTER,
  EMPTY_POINT,
} from '../api/constants.js';
import PointPresenter from './point-presenter.js';
import { FiltersCb, SortCb } from '../utils/functions.js';

const UiBlockerLimits = {
  LOWER_LIMIT: 100,
  UPPER_LIMIT: 2000,
};

export default class BoardPresenter {
  #pointsModel = null;
  #filtersModel = null;
  #mainContainer = null;

  #eventListComponent = new EventListView();
  #emptyListComponent = null;
  #newPointDisableHandler = null;
  #newPointEditComponent = null;
  #sortComponent = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: UiBlockerLimits.LOWER_LIMIT,
    upperLimit: UiBlockerLimits.UPPER_LIMIT,
  });

  #isCreatorMode = false;
  #filterResetHandler = null;

  #pointsPresenters = new Map();
  #currentSortOption = DEFAULT_SORT_OPTION;

  #rerenderInfo = null;

  constructor({
    mainContainer,
    pointsModel,
    filtersModel,
    rerenderInfo,
    newPointDisableHandler,
  }) {
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#rerenderInfo = rerenderInfo;
    this.#newPointDisableHandler = newPointDisableHandler;
  }

  get #filteredPoints() {
    const points = this.points;
    const currentFilter = this.#filtersModel.currentFilter;

    return currentFilter !== DEFAULT_FILTER
      ? points.filter(FiltersCb[currentFilter])
      : points;
  }

  get #sortedPoints() {
    const filteredPoints = this.#filteredPoints;

    if (filteredPoints.length === 0) {
      return [];
    }

    return filteredPoints.sort(SortCb[this.#currentSortOption]);
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  get offersData() {
    return this.#pointsModel.offersData;
  }

  get points() {
    return this.#pointsModel.points;
  }

  setfilterResetHandler(filterResetHandler) {
    this.#filterResetHandler = filterResetHandler;
  }

  init() {
    this.rerender();
    this.#rerenderInfo(this.#sortedPoints);
  }

  rerender() {
    this.#clearPoints();
    this.#renderPointsBoard();
  }

  #renderPointsBoard() {
    if (!this.#isCreatorMode && this.#sortedPoints.length === 0) {
      this.#renderEmptyList();
      return;
    }

    render(this.#eventListComponent, this.#mainContainer);

    this.#renderSort();
    this.#renderPoints();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      sortOptions: SortOptions,
      sortTypeChangeHandler: this.#sortPointsHandler,
      currentSortType: this.#currentSortOption,
    });

    render(
      this.#sortComponent,
      this.#eventListComponent.element,
      RenderPosition.BEFOREBEGIN,
    );
  }

  #renderEmptyList() {
    this.#emptyListComponent = new EmptyListView(
      this.#filtersModel.currentFilter,
    );
    render(this.#emptyListComponent, this.#mainContainer);
  }

  #destroyEmptyList = () => {
    remove(this.#emptyListComponent);
    this.#emptyListComponent = null;
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this.#eventListComponent.element,
      point,
      destinations: this.destinations,
      offersData: this.offersData,
      dataUpdateHandler: this.#pointChangeHandler,
      editorModeHandler: this.#editorModeHandler,
      pointDeleteHandler: this.#pointDeleteHandler,
    });
    pointPresenter.init();
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#sortedPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #clearPoints() {
    remove(this.#sortComponent);
    this.#sortComponent = null;
    this.#pointsPresenters.forEach((pointPresenter) =>
      pointPresenter.destroy(),
    );
    this.#pointsPresenters.clear();
    this.#destroyEmptyList();
  }

  #resetFilters() {
    this.#filtersModel.setCurrentFilter(DEFAULT_FILTER);
    this.#filterResetHandler();
    this.#currentSortOption = DEFAULT_SORT_OPTION;
    this.rerender();
  }

  filterTypeChangeHandler() {
    this.#currentSortOption = DEFAULT_SORT_OPTION;
    this.rerender();
  }

  #sortPointsHandler = (evt) => {
    if (this.#currentSortOption === evt.target.value) {
      return;
    }

    this.#currentSortOption = evt.target.value;
    this.rerender();
  };

  #pointDeleteHandler = async (id) => {
    this.#uiBlocker.block();

    const pointPresenter = this.#pointsPresenters.get(id);
    try {
      pointPresenter.setIsDeleting(true);
      await this.#pointsModel.deletePoint(id);
      this.rerender();
      this.#rerenderInfo(this.#sortedPoints);
    } catch {
      pointPresenter.setAborting();
    }

    this.#uiBlocker.unblock();
  };

  #editorModeHandler = () => {
    if (this.#isCreatorMode) {
      this.#creatorCloseHandler();
    }
    this.#pointsPresenters.forEach((pointPresenter) => {
      pointPresenter.resetMode();
    });
  };

  creatorOpenHandler = () => {
    if (this.#isCreatorMode) {
      return;
    }

    this.#isCreatorMode = true;

    if (this.#emptyListComponent) {
      this.#destroyEmptyList();
    }

    this.#newPointDisableHandler(true);
    this.#resetFilters();

    this.#newPointEditComponent = new PointEditorView({
      point: EMPTY_POINT,
      referenceData: {
        destinations: this.destinations,
        offersData: this.offersData,
      },
    });

    if (this.points.length === 0) {
      render(
        this.#newPointEditComponent,
        this.#mainContainer,
        RenderPosition.AFTERBEGIN,
      );
    } else {
      render(
        this.#newPointEditComponent,
        this.#eventListComponent.element,
        RenderPosition.AFTERBEGIN,
      );
    }
    this.#newPointEditComponent.setResetClickHandler(this.#creatorCloseHandler);
    this.#newPointEditComponent.setSubmitClickHandler(
      this.#creatorSubmitHandler,
    );
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #creatorCloseHandler = () => {
    this.#isCreatorMode = false;

    if (this.#sortedPoints.length === 0) {
      this.#renderEmptyList();
    }

    this.#newPointDisableHandler(false);
    remove(this.#newPointEditComponent);
    this.#newPointEditComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #creatorSubmitHandler = async (evt) => {
    this.#uiBlocker.block();

    evt.preventDefault();
    try {
      const point = { ...this.#newPointEditComponent.point };

      this.#newPointEditComponent.updateElement({
        isSaving: true,
        isDisabled: true,
      });
      await this.#pointsModel.createPoint(point);
      this.#creatorCloseHandler();
      this.rerender();
      this.#rerenderInfo(this.#sortedPoints);
    } catch {
      this.#newPointEditComponent.shake(
        this.#newPointEditComponent.updateElement({
          isSaving: false,
          isDisabled: false,
        }),
      );
    }

    this.#uiBlocker.unblock();
  };

  #pointChangeHandler = async (updatedPoint) => {
    this.#uiBlocker.block();

    const pointPresenter = this.#pointsPresenters.get(updatedPoint.id);
    try {
      pointPresenter.setIsSaving(true);
      await this.#pointsModel.updatePointServer(updatedPoint);
      this.rerender();
      this.#rerenderInfo(this.#sortedPoints);
    } catch {
      pointPresenter.setAborting();
    }

    this.#uiBlocker.unblock();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#creatorCloseHandler();
    }
  };
}
