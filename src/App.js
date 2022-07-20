import { useState } from 'react';
import FirebaseAuthService from './FirebaseAuthService';
import './App.css';
import LoginForm from './components/LoginForm';
import AddEditRecipeForm from './components/AddEditRecipeForm';
import FirebaseFirestoreService from './FirebaseFirestoreService';

function App() {
  const [user, setUser] = useState(null);

  FirebaseAuthService.subscribeToAuthChanges(setUser);

  async function handleAddRecipe(newRecipe) {
    console.log(newRecipe, 'New recipe from the handleAddRecipe');
    try {
      console.log('Before creating document');
      const response = await FirebaseFirestoreService.createDocument(
        'recipes',
        newRecipe
      );
      console.log(response)
      //Todo: fetch new recipes from firestore
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
        <AddEditRecipeForm
          handleAddRecipe={handleAddRecipe}
        ></AddEditRecipeForm>
      </div>
    </div>
  );
}

export default App;
