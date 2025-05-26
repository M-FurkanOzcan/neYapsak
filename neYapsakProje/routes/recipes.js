const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.render('recipes/index', {
      title: 'Tüm Tarifler - NeYapsak',
      recipes
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Server error', error: err });
  }
});

// Show recipe form
router.get('/new', (req, res) => {
  res.render('recipes/new', {
    title: 'Yeni Tarif Ekle - NeYapsak'
  });
});

// Create new recipe
router.post('/', async (req, res) => {
  try {
    const {
      title,
      ingredients,
      instructions,
      cookingTime,
      servings,
      imageUrl
    } = req.body;

    // Parse ingredients from form
    const ingredientsArray = [];

    if (ingredients && Array.isArray(ingredients.name)) {
      for (let i = 0; i < ingredients.name.length; i++) {
        if (ingredients.name[i]) {
          ingredientsArray.push({
            name: ingredients.name[i],
            quantity: ingredients.quantity[i] || ''
          });
        }
      }
    } else if (ingredients && ingredients.name) {
      // Tek malzeme girildiğinde dizi yerine string gelebilir
      ingredientsArray.push({
        name: ingredients.name,
        quantity: ingredients.quantity || ''
      });
    }



    const newRecipe = new Recipe({
      title,
      ingredients: ingredientsArray,
      instructions,
      cookingTime,
      servings,
      imageUrl: imageUrl || 'default-recipe.jpg',
    });

    await newRecipe.save();
    res.redirect(`/recipes/${newRecipe._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Server error', error: err });
  }
});

// Show single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).render('error', {
        message: 'Tarif bulunamadı',
        error: { status: 404 }
      });
    }
    res.render('recipes/show', {
      title: `${recipe.title} - NeYapsak`,
      recipe
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Server error', error: err });
  }
});

// Search recipes by ingredients
router.post('/search', async (req, res) => {
  try {
    const { ingredients } = req.body;

    // Create an array of ingredients from the comma-separated string
    const searchIngredients = ingredients
      .split(',')
      .map(item => item.trim().toLowerCase())
      .filter(item => item !== '');

    if (searchIngredients.length === 0) {
      return res.redirect('/recipes');
    }

    // Find recipes that contain the searched ingredients
    const recipes = await Recipe.find({
      'ingredients.name': {
        $in: searchIngredients.map(item => new RegExp(item, 'i'))
      }
    });

    res.render('recipes/search-results', {
      title: 'Arama Sonuçları - NeYapsak',
      recipes,
      searchTerms: searchIngredients.join(', ')
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Server error', error: err });
  }
});

// Add comment to recipe
router.post('/:id/comments', async (req, res) => {
  try {
    const { text, author } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).render('error', {
        message: 'Tarif bulunamadı',
        error: { status: 404 }
      });
    }

    recipe.comments.push({ text, author });
    await recipe.save();
    res.redirect(`/recipes/${recipe._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Server error', error: err });
  }
});

module.exports = router; 