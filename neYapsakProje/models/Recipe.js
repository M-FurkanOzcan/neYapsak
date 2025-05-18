const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  ingredients: [{
    name: String,
    quantity: String
  }],
  instructions: {
    type: String,
    required: true
  },
  cookingTime: {
    type: Number,
    required: true
  },
  servings: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    default: 'default-recipe.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    default: 0
  },
  comments: [{
    text: String,
    author: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('Recipe', RecipeSchema); 