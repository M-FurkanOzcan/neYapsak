require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const jwt = require('jsonwebtoken');
const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Kullanıcı bilgisini template'lere aktar
app.use((req, res, next) => {
    // Önce Authorization header'dan token'ı kontrol et
    let token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Eğer header'da yoksa, query string'den kontrol et
    if (!token) {
        token = req.query.token;
    }
    
    // Eğer query string'de de yoksa, body'den kontrol et
    if (!token) {
        token = req.body.token;
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            res.locals.user = decoded;
        } catch (error) {
            console.error('Token doğrulama hatası:', error);
        }
    }
    next();
});

// Database connection - MongoDB Atlas
// Aşağıdaki URI'yi kendi MongoDB Atlas bağlantı adresinizle değiştirin
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB Atlas bağlantısı başarılı'))
.catch(err => console.error('MongoDB bağlantı hatası:', err));

// Routes
const indexRoutes = require('./routes/index');
const recipeRoutes = require('./routes/recipes');
const authRoutes = require('./routes/auth');
const favoriteRoutes = require('./routes/favorites');

app.use('/', indexRoutes);
app.use('/recipes', recipeRoutes);
app.use('/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    title: 'Hata',
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Sayfa Bulunamadı',
    message: 'Aradığınız sayfa bulunamadı.',
    error: { status: 404 }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 