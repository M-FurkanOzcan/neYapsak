const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Home page route
router.get('/', async (req, res) => {
  try {
    // Get some featured recipes for the homepage
    const featuredRecipes = await Recipe.find().limit(6);
    res.render('index', { 
      title: 'NeYapsak - Eldeki Malzemelerle Yemek Tarifleri',
      recipes: featuredRecipes
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      message: 'Server error', 
      error: err 
    });
  }
});

// About page
router.get('/about', (req, res) => {
  res.render('about', { 
    title: 'Hakkımızda - NeYapsak' 
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact', { 
    title: 'İletişim - NeYapsak' 
  });
});

// Favorites page
router.get('/favorites', (req, res) => {
  res.render('favorites', { 
    title: 'Favori Tariflerim - NeYapsak' 
  });
});

module.exports = router; 