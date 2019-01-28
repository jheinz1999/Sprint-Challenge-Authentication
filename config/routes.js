const axios = require('axios');
const bcrypt = require('bcryptjs');

const { authenticate, generateToken } = require('../auth/authenticate');
const db = require('../database/dbConfig');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

async function register(req, res) {

  let { username, password } = req.body;

  if (!username) {

    res.status(400).json({message: 'Please provide a username!'});
    return;

  }

  if (!password) {

    res.status(400).json({message: 'Please provide a password!'});
    return;

  }

  try {

    // quick development hash
    password = await bcrypt.hash(password, 2);

    const [ id ] = await db.insert({ username, password }).into('users');

    const user = await db.select().from('users').where({ id }).first();

    const token = await generateToken(user);

    res.status(201).json({user, token});

  }

  catch (err) {

    const exists = await db.select().from('users').where({ username });

    if (exists.length > 0)
      res.status(400).json({message: 'That username exists!'});

    else
      res.status(500).json({message: 'We had a problem handling your request.'});

  }

}

async function login(req, res) {

  const { username, password } = req.body;

  if (!username) {

    res.status(400).json({message: 'Please provide a username!'});
    return;

  }

  if (!password) {

    res.status(400).json({message: 'Please provide a password!'});
    return;

  }

  try {

    const user = await db.select().from('users').where({ username }).first();

    if (user) {

      const correct = await bcrypt.compare(password, user.password);

      if (correct) {

        const token = await generateToken(user);

        res.status(200).json({user, token});
        return;

      }

    }

  }

  catch (err) {

    res.status(500).json({message: 'We had a problem handling your request.'});

  }

  res.status(401).json({message: 'Invalid credentials!'});

}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
