import express from 'express';

const router = express.Router();
import { getMenu, trashMenu, updateMenu } from './controllers/menu';
import {
  getAllProverbs,
  getProverbe,
  updateProverbe,
} from './controllers/proverbe';
import {
  ajoutMessage,
  getMessage,
  trashAllMessage,
  trashMessage,
} from './controllers/messages';
import { addRecipe, getRecipe, getRecipes } from './controllers/recipes';
import {
  createPreferences,
  getAllPreferences,
  getPreferences,
  updatePreferences,
} from './controllers/design';

// gérer les menus
router.get('/menu', getMenu);
router.post('/menuajout', updateMenu);
router.delete('/menufinal', trashMenu);

// gérer le proverbe
router.get('/proverbe', getProverbe);
router.post('/proverbeajout', updateProverbe);
router.get('/allProverbe', getAllProverbs);

// gérer les messages
router.get('/miammi', getMessage);
router.post('/miammiajout', ajoutMessage);
router.delete('/deletemsg/:id', trashMessage);
router.delete('/deletemiammi', trashAllMessage);

// gérer les recettes
router.get('/recipes', getRecipes);
router.get('/recipe/:slug', getRecipe);
router.post('/recipeajout', addRecipe);

//gérer les préférences
router.get('/allPreferences', getAllPreferences);
router.post('/getPreferences', getPreferences);
router.post('/updatePreferences', updatePreferences);
router.post('/addDesign', createPreferences);

export { router as api };
