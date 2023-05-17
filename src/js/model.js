import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { ajax } from './helpers';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookMark: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await ajax(`${API_URL}${id}?key=<insert your key>`);
    state.recipe = createRecipeObject(data);
    if (state.bookMark.some(bookmark => bookmark.id === id))
      state.recipe.bookMarked = true;
    else state.recipe.bookMarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchRecipe = async function (query) {
  try {
    const data = await ajax(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const PageResult = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage; //0
  const end = page * state.search.resultPerPage; //10

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};

const persistBookMark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookMark));
};

export const addBookMark = function (recipe) {
  //
  state.bookMark.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookMarked = true;
  persistBookMark();
};

export const deleteBookMark = function (id) {
  const index = state.bookMark.findIndex(el => el.id === id);
  state.bookMark.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookMarked = false;
  persistBookMark();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookMark = JSON.parse(storage);
};

export const uploadRecipe = async function (newRecipe) {
  try {
    // console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(result => {
        const ingr = result[1].split(',').map(el => el.trim());
        if (ingr.length !== 3)
          throw new Error(
            'Wrong Ingredient Format! Please use the Correct Format'
          );
        const [quantity, unit, description] = ingr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await ajax(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};

init();
