import icons from 'url:../../img/icons.svg';
import view from './view.js';
import { RES_PER_PAGE } from '../config.js';
class Pargination extends view {
  //
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
      console.log(btn);
      console.log(goToPage);
    });
  }

  _generateMarkUp() {
    const numPage = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    const currPage = this._data.page;

    //1. page 1 and there many pages
    if (currPage === 1 && numPage > 1) {
      return ` <button data-goto="${
        currPage + 1
      } "class="btn--inline pagination__btn--next">
      <span>Page ${currPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }

    //2.last page

    if (currPage === numPage && numPage > 1) {
      return `
      <button data-goto="${
        currPage - 1
      } " class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>
      `;
    }
    //3.other pages and there other pages

    if (currPage < numPage) {
      return ` <button data-goto="${
        currPage + 1
      } " class="btn--inline pagination__btn--next">
      <span>Page ${currPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>

    <button data-goto="${
      currPage - 1
    } " class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>
    `;
    }

    //4: only one page
    return '';
  }
}

export default new Pargination();
