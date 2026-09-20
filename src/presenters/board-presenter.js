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

const UiBlokerLimits = {
  LOWER_LIMIT: 100,
  UPPER_LIMIT: 2000
};

export default class BoardPresenter {
  #pointsModel = null;
  #filtersModel = null;
  #mainContainer = null;

  #eventListComponent = new EventListView();
  #emptyListComponent = null;
  #newPointEditComponent = null;
  #sortComponent = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: UiBlokerLimits.LOWER_LIMIT,
    upperLimit: UiBlokerLimits.UPPER_LIMIT
  });

  #isCreatorMode = false;

  #pointsPresenters = new Map();
  #currentSortOption = DEFAULT_SORT_OPTION;

  constructor({ mainContainer, pointsModel, filtersModel }) {
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
  }

  get #filteredPoints() {
    const points = [...this.#pointsModel.points];
    const currentFilter = this.#filtersModel.currentFilter;

    return currentFilter !== DEFAULT_FILTER
      ? points.filter(FiltersCb[currentFilter])
      : points;
  }

  get #sortedPoints() {
    const filteredPoints = this.#filteredPoints;

    return this.#currentSortOption !== DEFAULT_SORT_OPTION
      ? filteredPoints.sort(SortCb[this.#currentSortOption])
      : filteredPoints;
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

  init() {
    this.rerender();
  }

  rerender() {
    this.#clearPoints();
    this.#renderPointsBoard();
  }

  #renderPointsBoard() {
    if (this.#sortedPoints.length === 0) {
      this.#emptyListComponent = new EmptyListView(
        this.#filtersModel.currentFilter,
      );
      render(this.#emptyListComponent, this.#mainContainer);
      return;
    }
    render(this.#eventListComponent, this.#mainContainer);
    if (this.#sortedPoints.length === 0) {
      this.#renderEmptyList();
      return;
    }
    this.#renderSort();
    this.#renderPoints();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      sortOptions: SortOptions,
      onSortTypeChange: this.#handleSortPoints,
      currentSortType: this.#currentSortOption,
    });

    render(this.#sortComponent, this.#eventListComponent.element);
  }

  #renderEmptyList() {
    render(this.#emptyListComponent, this.#mainContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this.#eventListComponent.element,
      point,
      destinations: this.destinations,
      offersData: this.offersData,
      onDataUpdate: this.#handlePointChange,
      onModeChange: this.#handleEditorMode,
      onPointDelete: this.#handlePointDelete,
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
    remove(this.#emptyListComponent);
    this.#emptyListComponent = null;
  }

  handleFilterTypeChange() {
    this.#currentSortOption = DEFAULT_SORT_OPTION;
    this.rerender();
  }

  #handleSortPoints = (sortType) => {
    if (this.#currentSortOption === sortType) {
      return;
    }

    this.#currentSortOption = sortType;
    this.rerender();
  };

  #handlePointDelete = async (id) => {
    this.#uiBlocker.block();

    const pointPresenter = this.#pointsPresenters.get(id);
    try {
      pointPresenter.setIsDeleting(true);
      await this.#pointsModel.deletePoint(id);
      this.rerender();
    } catch {
      pointPresenter.setAborting();
    }

    this.#uiBlocker.unblock();
  };

  #handleEditorMode = () => {
    if (this.#isCreatorMode) {
      this.#handleCreatorClose();
    }
    this.#pointsPresenters.forEach((pointPresenter) => {
      pointPresenter.resetMode();
    });
  };

  handleCreatorOpen = () => {
    if (this.#isCreatorMode) {
      return;
    }

    this.#handleEditorMode();
    this.#isCreatorMode = true;
    this.#newPointEditComponent = new PointEditorView({
      point: EMPTY_POINT,
      referenceData: {
        destinations: this.destinations,
        offersData: this.offersData,
      },
    });
    render(
      this.#newPointEditComponent,
      this.#sortComponent.element,
      RenderPosition.AFTEREND,
    );
    this.#newPointEditComponent.setResetClickHandler(this.#handleCreatorClose);
    this.#newPointEditComponent.setSubmitClickHandler(
      this.#handleCreatorSubmit,
    );
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleCreatorClose = () => {
    this.#isCreatorMode = false;
    remove(this.#newPointEditComponent);
    this.#newPointEditComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleCreatorSubmit = async (evt) => {
    this.#uiBlocker.block();

    evt.preventDefault();
    try {
      const point = { ...this.#newPointEditComponent.point };

      this.#newPointEditComponent.updateElement({
        isSaving: true,
        isDisabled: true
      });
      await this.#pointsModel.createPoint(point);
      this.#handleCreatorClose();
      this.rerender();
    } catch (e) {
      this.#newPointEditComponent.shake(
        this.#newPointEditComponent.updateElement({
          isSaving: false,
          isDisabled: false
        })
      );
    }

    this.#uiBlocker.unblock();
  };

  #handlePointChange = async (updatedPoint) => {
    this.#uiBlocker.block();

    const pointPresenter = this.#pointsPresenters.get(updatedPoint.id);
    try {
      pointPresenter.setIsSaving(true);
      await this.#pointsModel.updatePointServer(updatedPoint);
      this.rerender();
    } catch (e) {
      pointPresenter.setAborting();
    }

    this.#uiBlocker.unblock();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#handleCreatorClose();
    }
  };
}
