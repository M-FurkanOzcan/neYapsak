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
    if (Array.isArray(ingredients.name)) {
      for (let i = 0; i < ingredients.name.length; i++) {
        if (ingredients.name[i]) {
          ingredientsArray.push({
            name: ingredients.name[i],
            quantity: ingredients.quantity[i] || ''
          });
        }
      }
    } else {
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
    
    // Find recipes that contain AT LEAST ONE of the searched ingredients
    const allMatchingRecipes = await Recipe.find({
      'ingredients.name': { 
        $in: searchIngredients.map(item => new RegExp(item, 'i')) 
      }
    }).lean(); // .lean() performansı artırabilir ve Mongoose dökümanlarını sadeleştirir

    // Calculate match count for each recipe and sort
    const sortedRecipes = allMatchingRecipes.map(recipe => {
      let matchCount = 0;
      // Tarifin malzeme isimlerini küçük harfe çevirerek bir dizi oluştur
      const recipeIngredientNames = recipe.ingredients.map(ing => ing.name.toLowerCase());
      
      searchIngredients.forEach(searchIng => {
        // Aranan her malzemenin, tarifin malzeme listesinde olup olmadığını kontrol et
        // .includes() kullanarak kısmi eşleşmelere de izin ver (örneğin "domate" "domates" ile eşleşir)
        // Tam eşleşme isteniyorsa: recipeIngredientNames.includes(searchIng)
        if (recipeIngredientNames.some(recipeIngName => recipeIngName.includes(searchIng))) {
          matchCount++;
        }
      });
      return { ...recipe, matchCount }; // Orijinal tarife matchCount ekle
    }).sort((a, b) => b.matchCount - a.matchCount); // Eşleşme sayısına göre büyükten küçüğe sırala
    
    res.render('recipes/search-results', {
      title: 'Arama Sonuçları - NeYapsak',
      recipes: sortedRecipes, // Sıralanmış tarifleri gönder
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