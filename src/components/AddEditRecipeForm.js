import React, { useState } from 'react';

function AddEditRecipeForm({ handleAddRecipe }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [publishDate, setPublishDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [directions, setDirections] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState([]);

  function handleAddIngredient(e) {
    if (e.key && e.key !== 'Enter') {
      return;
    }
    e.preventDefault();

    if (!ingredientName) {
      alert('Missing Ingredient field. Please double check.');
      return;
    }

    setIngredients([...ingredients, ingredientName]);
    setIngredientName('');
  }

  return (
    <form className="add-edit-recipe-form-container">
      <h2>Add a New Recipe</h2>
      <div className="top-form-section">
        <div className="fields">
          <label className="recipe-label input-label">
            Recipe Name:
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-text"
            />
          </label>

          <label className="recipe-label input-label">
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.event)}
              className="select"
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

          <label className="recipe-label input-label">
            Directions:
            <textarea
              required
              value={directions}
              onChange={(e) => {
                setDirections(e.target.value);
              }}
              className="input-text"
            ></textarea>
          </label>

          <label className="recipe-label input-label">
            Publish Date:
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="input-text"
            ></input>
          </label>
        </div>
      </div>
      <div className="ingredients-list">
        <h3 className="text-center">Ingredients</h3>
        <table className="ingredients-table">
          <thead>
            <tr>
              <th className="table-header">Ingredient</th>
              <th className="table-header">Delete</th>
            </tr>
          </thead>
              {ingredients && ingredients.length > 0
                ? ingredients.map((ingredient) => {
                    return (
                      <tr key={ingredient}>
                        <td className="table-data text-center">
                          {ingredient}
                        </td>
                        <td className="ingredient-delete-box">
                          <button className="secondary-button ingredient-delete-button">
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                : null}
        </table>

        {ingredients && ingredients.length === 0 ? (
          <h3 className="text center no-ingredients">
            No Ingredients Added Yet
          </h3>
        ) : null}

        <div className="ingredient-form">
          <label className="ingredient-label">
            Ingredient:
            <input
              type="text"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              className="input-text"
              placeholder="ex. 1 cup of sugar"
              onKeyPress={handleAddIngredient}
            ></input>
          </label>

          <button
            type="button"
            className="primary-button add-ingredient-button"
            onClick={handleAddIngredient}
          >
            Add Ingredient
          </button>
        </div>
      </div>
    </form>
  );
}

export default AddEditRecipeForm;