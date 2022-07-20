import { useState, useEffect } from 'react';
import FirebaseAuthService from './FirebaseAuthService';
import './App.css';
import LoginForm from './components/LoginForm';
import AddEditRecipeForm from './components/AddEditRecipeForm';
import FirebaseFirestoreService from './FirebaseFirestoreService';

function App() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes()
      .then((fetchedRecipes) => {
        setRecipes(fetchedRecipes);
      })
      .catch((error) => {
        console.error(error.message);
        throw error;
      })
  }, []);

  FirebaseAuthService.subscribeToAuthChanges(setUser);

  async function fetchRecipes() {
    let fetchedRecipes = [];
    try {
      const response = await FirebaseFirestoreService.readDocuments('recipes');
      const newRecipes = response.docs.map((recipeDoc) => {
        const id = recipeDoc.id;
        const data = recipeDoc.data();
        data.publishDate = new Date(data.publishDate.seconds * 1000)
        return { ...data, id };
      });
      fetchedRecipes = [...newRecipes];
    } catch (error) {
      console.log(error.message);
      throw error;
    }
    return fetchedRecipes; 
  }

  async function handleFetchedRecipes(){
    try {
      const fetchedRecipes = await fetchRecipes()
      setRecipes(fetchedRecipes); 
    } catch (error) {
      console.error(error.message)
      throw error; 
    }
  }

  console.log(recipes); 
  async function handleAddRecipe(newRecipe) {
    console.log(newRecipe, 'New recipe from the handleAddRecipe');
    try {
      console.log('Before creating document');
      const response = await FirebaseFirestoreService.createDocument(
        'recipes',
        newRecipe
      );
      handleFetchedRecipes()
      alert(
        `succesfully created new recipe with an Id ${response.id}`
      );
    } catch (error) {}
  }

  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title">VGP</h1>
        <LoginForm existingUser={user}></LoginForm>
      </div>
      <div className="main">
        {user ? (
          <AddEditRecipeForm
            handleAddRecipe={handleAddRecipe}
          ></AddEditRecipeForm>
        ) : null}
      </div>
    </div>
  );
}

export default App;
