require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const jwt = require('jsonwebtoken');
const app = express();
const cookieParser = require('cookie-parser');
const User = require('./models/User'); // 🔼 En üstte tanımla

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(cookieParser());

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Kullanıcı bilgisini template'lere aktar
app.use(async (req, res, next) => {
  let token = null;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token && req.header('Authorization')) {
    token = req.header('Authorization').replace('Bearer ', '');
  }

  if (!token) {
    token = req.query.token || req.body.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).lean();
      req.user = user;
      res.locals.user = user;
    } catch (error) {
      console.error('Token doğrulama hatası:', error);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
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