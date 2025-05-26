const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Login sayfasını göster
router.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Giriş Yap - NeYapsak' });
});

// Signup sayfasını göster
router.get('/signup', (req, res) => {
    res.render('auth/signup', { title: 'Kayıt Ol - NeYapsak' });
});

// Kayıt olma
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Şifre uzunluğunu kontrol et
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Şifre en az 6 karakter olmalı' });
        }

        // Kullanıcı adı veya email zaten var mı kontrol et
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu kullanıcı adı veya email zaten kullanılıyor' });
        }

        // Yeni kullanıcı oluştur
        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        // JWT token oluştur
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Signup Route Error:", error); // Sunucu tarafında hatayı logla
        if (error.name === 'ValidationError') {
            // Mongoose doğrulama hatası
            if (error.errors && error.errors.password) {
                // Özellikle şifre alanı için bir doğrulama hatası varsa
                return res.status(400).json({ message: 'Şifre en az 6 karakter olmalı' });
            } else {
                // Diğer alanlar için Mongoose doğrulama hataları (örn: email formatı, kullanıcı adı zorunlu vb.)
                const messages = Object.values(error.errors).map(val => val.message);
                return res.status(400).json({ message: messages.join('. ') });
            }
        }
        // Diğer beklenmedik sunucu hataları
        res.status(500).json({ message: 'Sunucu tarafında bir hata oluştu. Lütfen tekrar deneyin.' });
    }
});

// Giriş yapma
// Giriş yapma
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Token'ı cookie'ye yaz
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && req.secure,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 🔽 JSON dön
    return res.status(200).json({
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
});



module.exports = router; 