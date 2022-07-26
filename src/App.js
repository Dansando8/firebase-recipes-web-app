import { useState, useEffect } from 'react';
import FirebaseAuthService from './FirebaseAuthService';
import './App.css';
import LoginForm from './components/LoginForm';
import AddEditRecipeForm from './components/AddEditRecipeForm';
import FirebaseFirestoreService from './FirebaseFirestoreService';

function App() {
  const [user, setUser] = useState(null);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, SetIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [orderBy, setOrderBy] = useState('publishDateDesc');
  const [recipesPerPage, setRecipesPerPage] = useState(3)

  useEffect(() => {
    SetIsLoading(true);
    fetchRecipes()
      .then((fetchedRecipes) => {
        setRecipes(fetchedRecipes);
      })
      .catch((error) => {
        console.error(error.message);
        throw error;
      })
      .finally(() => {
        SetIsLoading(false);
      });
  }, [user, categoryFilter, orderBy, recipesPerPage]);

  FirebaseAuthService.subscribeToAuthChanges(setUser);

  async function fetchRecipes(cursorId = '') {
    const queries = [];

    if (categoryFilter) {
      queries.push({
        field: 'category',
        condition: '==',
        value: categoryFilter,
      });
    }

    if (!user) {
      queries.push({
        field: 'isPublished',
        condition: '==',
        value: true,
      });
    }

    const orderByField = 'publishDate';
    let orderByDirection;

    if (orderBy) {
      switch(orderBy) {
        case 'publishDateAsc': orderByDirection = "asc";
        break; 
        case 'publishDateDesc': orderByDirection = "desc";
        break; 
        default: 
        break; 
      }
    }

    let fetchedRecipes = [];
    try {
      const response = await FirebaseFirestoreService.readDocuments({
        collection: 'recipes',
        queries: queries,
        orderByField: orderByField, 
        orderByDirection: orderByDirection,
        perPage: recipesPerPage, 
        cursorId : cursorId, 
      });
      const newRecipes = response.docs.map((recipeDoc) => {
        const id = recipeDoc.id;
        const data = recipeDoc.data();
        data.publishDate = new Date(data.publishDate.seconds * 1000);
        return { ...data, id };
      });

      if(cursorId){
        fetchedRecipes = [...recipes, ...newRecipes];
      } else {
        fetchedRecipes = [...newRecipes];
      }

    } catch (error) {
      console.log(error.message);
      throw error;
    }
    return fetchedRecipes;
  }

  function handleRecipesPerPageChange(event){
    const recipesPerPage = event.target.value; 
    setRecipes([]); 
    setRecipesPerPage(recipesPerPage)
  }

  function handleLoadMoreRecipesClick(){
    const lastRecipe = recipes[recipes.length -1]; 
    const cursorId = lastRecipe.id; 
    handleFetchedRecipes(cursorId);
  }

  async function handleFetchedRecipes(cursorId = "") {
    try {
      const fetchedRecipes = await fetchRecipes(cursorId);
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async function handleAddRecipe(newRecipe) {
    console.log(newRecipe, 'New recipe from the handleAddRecipe');
    try {
      console.log('Before creating document');
      const response = await FirebaseFirestoreService.createDocument(
        'recipes',
        newRecipe
      );
      handleFetchedRecipes();
      alert(
        `succesfully created new recipe with an Id ${response.id}`
      );
    } catch (error) {
      console.error(error.message);
    }
  }

  async function handleUpdateRecipe(newRecipe, recipeId) {
    try {
      await FirebaseFirestoreService.updateDocument(
        'recipes',
        recipeId,
        newRecipe
      );

      handleFetchedRecipes();

      alert(`successfully updated a recipe with an ID = ${recipeId}`);
      setCurrentRecipe(null);
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function handleDeleteRecipe(recipeId) {
    const deleteConfirmation = window.confirm(
      'Are you sure want to delete this recipe? OK for yes. Cancel for No.'
    );
    if (deleteConfirmation) {
      try {
        await FirebaseFirestoreService.deleteDocument(
          'recipes',
          recipeId
        );

        handleFetchedRecipes();

        setCurrentRecipe(null);

        window.scrollTo(0, 0);

        alert(`Succesfully deleted recipe with ID: ${recipeId}`);
      } catch (error) {
        alert(error.message);
        throw error;
      }
    }
  }

  function handleEditRecipeClick(recipeId) {
    const selectedRecipe = recipes.find((recipe) => {
      return recipe.id === recipeId;
    });
    if (selectedRecipe) {
      setCurrentRecipe(selectedRecipe);
      console.log('just before scrolling');
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  function handleEditRecipeCancel() {
    setCurrentRecipe(null);
  }

  function lookupCategoryLabel(categoryKey) {
    const categories = {
      breadsSandwichesAndPizza: 'Breads, Sandwiches & Pizza',
      eggsAndBreakfast: 'Eggs & Breakfast',
      dessertsAndBakedGoods: 'Desserts & Baked Goods',
      fishAndSeaFood: 'Fish & Sea Food',
      vegetables: 'Vegetables',
    };
    const label = categories[categoryKey];
    return label;
  }

  function formatDate(date) {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getFullYear();
    const dateString = `${day} ${month} ${year}`;
    return dateString;
  }

  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title">VGP</h1>
        <LoginForm existingUser={user}></LoginForm>
      </div>
      <div className="main">
        <div className="row filters">
          <label className="recipe-label input-label">
            Category:
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="select"
              required
            >
              <option value=""></option>
              <option value="breadsSandwichesAndPizza">
                Breads, Sandwiches & Pizza
              </option>
              <option value="eggsAndBreakfast">
                Eggs & Breakfast
              </option>
              <option value="dessertsAndBakedGoods">
                Desserts & Baked Goods
              </option>
              <option value="fishAndSeaFood">Fish & Sea Food</option>
              <option value="vegetables">Vegetables</option>
            </select>
          </label>
          <label className="input-label">
            <select 
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            className="select"
            > 
            <option value="publishDateDesc"> Publish Date (newest - oldest) </option>
            <option value="publishDateAsc"> Publish Date (oldest - newest) </option>
            </select>
          </label>
        </div>
        <div className="center">
          <div className="recipe-list-box">
            {isLoading ? (
              <div className="fire">
                <div className="flames">
                  <div className="flame"></div>
                  <div className="flame"></div>
                  <div className="flame"></div>
                  <div className="flame"></div>
                </div>
                <div className="logs"></div>
              </div>
            ) : null}
            {!isLoading && recipes && recipes.length === 0 ? (
              <h5 className="no-recipes">No recipes found</h5>
            ) : null}
            {recipes && recipes.length > 0 ? (
              <div className="recipe-list">
                {recipes.map((recipe) => {
                  return (
                    <div className="recipe-card" key={recipe.id}>
                      {recipe.isPublished === false ? (
                        <div className="unpublished">
                          UNPULBLISHED
                        </div>
                      ) : null}
                      <div className="recipe-name">{recipe.name}</div>
                      <div className="recipe-field">
                        Category:{' '}
                        {lookupCategoryLabel(recipe.category)}
                      </div>
                      <div className="recipe-field">
                        Publish Date: {formatDate(recipe.publishDate)}
                      </div>
                      {user ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleEditRecipeClick(recipe.id)
                          }
                          className="primary-button edit-button"
                        >
                          EDIT
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
        {
          isLoading || (recipes && recipes.length > 0 )  ? (
            <>
            <label className='input-label'>
              Recipes Per Page : 
              <select
                value={recipesPerPage}
                onChange={handleRecipesPerPageChange}
                className="select"
              >
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="9">9</option>
              </select>
            </label>
            <div className="pagination">
              <button type="button" onClick={handleLoadMoreRecipesClick} className="primary-button">LOAD MORE RECIPES</button>
            </div>
            </>
          ) : null
        }
        {user ? (
          <AddEditRecipeForm
            existingRecipe={currentRecipe}
            handleAddRecipe={handleAddRecipe}
            handleUpdateRecipe={handleUpdateRecipe}
            handleDeleteRecipe={handleDeleteRecipe}
            handleEditRecipeCancel={handleEditRecipeCancel}
          ></AddEditRecipeForm>
        ) : null}
      </div>
    </div>
  );
}

export default App;
