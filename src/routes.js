const { Router } = require('express');

const routes = Router();

const { users } = require('./users.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import the 'jsonwebtoken' package
const jwtSecret = 'jwtkey';
let loggedUser = null;

routes.get('/', (req, res) => {
  res.send('Hello World!');
});

//login
routes.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, password: user.password },
      jwtSecret // Use the JWT secret directly instead of calling the generateJwt() function
    );
    user.token = token;
    loggedUser = user;
    res.json(loggedUser);
  }
});

routes.post('/auth', (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, password: user.password },
      jwtSecret // Use the JWT secret directly instead of calling the generateJwt() function
    );
    user.token = token;
    loggedUser = user;
    res.json(loggedUser);
  } else {
    // User not found or incorrect password
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

routes.post('/create', (req, res) => {
  if (!loggedUser || loggedUser.type !== 'admin') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { name, email, password, type } = req.body;

  const user = users.find((u) => u.email === email);

  if (user) {
    res.status(400).json({ error: 'User already exists' });
  } else {
    users.push({ name, email, password, type });
    res.json({ message: 'User created successfully' });
  }
});

routes.get('/users', (req, res) => {
  if (!loggedUser || loggedUser.type !== 'admin') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  res.json(users);
});

routes.post('/deleteusers', (req, res) => {
  if (!loggedUser || loggedUser.type !== 'admin') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { email } = req.body;

  const user = users.find((u) => u.email === email);

  if (user) {
    users.splice(users.indexOf(user), 1);
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(400).json({ error: 'User not found' });
  }
});

routes.post('/updateusers', (req, res) => {
  if (!loggedUser || loggedUser.type !== 'admin') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { email, name, password, type } = req.body;

  const user = users.find((u) => u.email === email);

  if (user) {
    user.name = name;
    user.password = password;
    user.type = type;
    res.json({ message: 'User updated successfully', user });
  } else {
    res.status(400).json({ error: 'User not found' });
  }
});

module.exports = routes;
