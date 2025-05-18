const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Favori tarifleri getir
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('favoriteRecipes');
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }
        console.log('Favorite Recipes:', user.favoriteRecipes); // Hata ayıklama için log ekle
        console.log('Type of favoriteRecipes:', typeof user.favoriteRecipes); // Tür kontrolü
        res.json(user.favoriteRecipes);
    } catch (error) {
        console.error('Sunucu hatası:', error); // Hata mesajını logla
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Favori tarif ekle
router.post('/:recipeId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        
        // Tarif zaten favorilerde mi kontrol et
        if (user.favoriteRecipes.includes(req.params.recipeId)) {
            return res.status(400).json({ message: 'Bu tarif zaten favorilerinizde' });
        }

        user.favoriteRecipes.push(req.params.recipeId);
        await user.save();

        res.json({ message: 'Tarif favorilere eklendi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Favori tarifi kaldır
router.delete('/:recipeId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        
        // Tarif favorilerde var mı kontrol et
        if (!user.favoriteRecipes.includes(req.params.recipeId)) {
            return res.status(400).json({ message: 'Bu tarif favorilerinizde bulunmuyor' });
        }

        user.favoriteRecipes = user.favoriteRecipes.filter(id => id.toString() !== req.params.recipeId);
        await user.save();

        res.json({ message: 'Tarif favorilerden kaldırıldı' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

module.exports = router; 