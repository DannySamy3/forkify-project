import icons from 'url:../../img/icons.svg';
import fracty from 'fracty';
export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;

    const markUp = this._generateMarkUp();

    if (!render) return markUp;
    this._addHtmlElement(markUp);
  }

  update(data) {
    this._data = data;

    const newMarkUp = this._generateMarkUp();
    const newDOM = document.createRange().createContextualFragment(newMarkUp);
    const newElement = Array.from(newDOM.querySelectorAll('*'));
    const curElement = Array.from(this._parentElement.querySelectorAll('*'));

    newElement.forEach((newEl, i) => {
      const curEl = curElement[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    const markUp = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div> `;
    this._addHtmlElement(markUp);
    // this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  renderError(message = this._errorMessage) {
    const markUp = `
    <div class="error">
         <div>
          <svg>
           <use href="${icons}#icon-alert-triangle"></use>
            </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._addHtmlElement(markUp);
  }

  renderMessage(message = this._message) {
    const markUp = `
    <div class="error">
         <div>
          <svg>
           <use href="${icons}#icon-icon-smile"></use>
            </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._addHtmlElement(markUp);
  }

  _generateMarkUpIngredient(ing) {
    return `
    <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="src/img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ing.quantity ? fracty(ing.quantity).toString() : ''
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>`;
  }
  _addHtmlElement(markUp) {
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
}
