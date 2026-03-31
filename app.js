const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'a_very_secret_key_for_demo',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }
}));

const validUser = {
  username: 'admin',
  password: 'admin'
};

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/welcome');
  }
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === validUser.username && password === validUser.password) {
    req.session.user = { username };
    return res.redirect('/welcome');
  }
  res.status(401).render('login', { error: 'Invalid credentials. Use admin/admin.' });
});

app.get('/welcome', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render('welcome', {
    username: req.session.user.username,
    ptTools: [
      'Microsoft Azure Load Testing',
      'Apache JMeter',
      'Locust',
      'OpenText LoadRunner',
      'OpenText Silk Performer'
    ]
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
