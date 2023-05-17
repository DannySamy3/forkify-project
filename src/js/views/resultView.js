import View from './view';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query! Please try again :)';
  _message = '';

  _generateMarkUp() {
    return this._data
      .map(bookMark => previewView.render(bookMark, false))
      .join('');
  }
}

export default new ResultsView();
