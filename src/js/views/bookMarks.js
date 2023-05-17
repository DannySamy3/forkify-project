import View from './view';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class BookMarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookMark Found,Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkUp() {
    return this._data
      .map(bookMark => previewView.render(bookMark, false))
      .join('');
  }
}

export default new BookMarkView();
