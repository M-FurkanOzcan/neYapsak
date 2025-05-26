const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const Message = require('../models/Message');

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
  const success = req.query.success;
  res.render('contact', { success });
});

router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await Message.create({ name, email, message });
    res.redirect('/contact?success=1');
  } catch (err) {
    console.error('Mesaj gönderme hatası:', err);
    res.status(500).send('Sunucu hatası. Lütfen tekrar deneyin.');
  }
});

// Favorites page
router.get('/favorites', (req, res) => {
  res.render('favorites', { 
    title: 'Favori Tariflerim - NeYapsak' 
  });
});

module.exports = router; 