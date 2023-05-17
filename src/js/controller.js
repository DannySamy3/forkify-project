import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/renderView.js';
import { async } from 'regenerator-runtime';
import SearchView from './views/searchView.js';
import resultView from './views/resultView.js';
import bookmarksView from './views/bookMarks.js';
import parginationView from './views/parginationView.js';
import addRecipe from './views/addRecipeView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // renderSpinner(recipeContainer);
    recipeView.renderSpinner();

    //Render Recipe
    await model.loadRecipe(id);
    // const { recipe } = model.state;

    recipeView.render(model.state.recipe);

    resultView.update(model.PageResult());
    bookmarksView.update(model.state.bookMark);

    // recipeContainer.innerHTML = '';

    // recipeContainer.insertAdjacentHTML('afterbegin', markUp);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResult = async function () {
  const query = SearchView.getQuery();

  if (!query) return;
  await model.loadSearchRecipe(query);
  resultView.renderSpinner();
  resultView.render(model.PageResult());
  parginationView.render(model.state.search);
};
const controlPagination = function (goToPage) {
  //1.Render New Results

  resultView.render(model.PageResult(goToPage));

  //2.Render New Pagination buttons
  parginationView.render(model.state.search);
};

const controlServing = function (newServing) {
  model.updateServings(newServing);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  if (!model.state.recipe.bookMarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);

  recipeView.update(model.state.recipe);
  // bookmarksView.update(model.state.bookMark);
  bookmarksView.render(model.state.bookMark);
};
const controlBookMarks = function () {
  bookmarksView.render(model.state.bookMark);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    addRecipe.renderSpinner();
    //Render recipe
    recipeView.render(model.state.recipe);

    //Render success Message
    addRecipe.renderMessage();

    //render Bookmark view
    bookmarksView.render(model.state.bookMark);

    //Change Id URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipe.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookMarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServing);
  SearchView.addSearchHandler(controlSearchResult);
  parginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerBookMark(controlAddBookMark);
  addRecipe.addHandlerUpload(controlAddRecipe);
};

init();
