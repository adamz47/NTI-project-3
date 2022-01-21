const express = require('express');
const routers = express.Router();
const User = require('../models/user');
const auth = require('../middelware/auth');


// Routes
// POST Route "Sign UP"
routers.post('/signup', async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// POST Route "Login"
routers.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    // Generate Token
    const token = await user.generateToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET Route "Profile"
routers.get('/profile', auth, async (req, res) => {
  res.send(req.user);
});

// PATCH Route "UPDATE user"
routers.patch('/edit', auth, async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      updates.forEach((update) => (req.user[update] = req.body[update]));
      await req.user.save();
      res.send('Updated successfully' + req.user);
    } catch (error) {
      res.status(400).send(error);
    }
  });

// DELETE Route "Logout All"
routers.delete('/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send('You have loged out from all the sessions Successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// DELETE Route "Logout"
routers.delete('/logout', auth, async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter((el) => {
        return el !== req.token;
      });
      await req.user.save();
      res.send('You have loged out Successfully');
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

// DELETE Route "Delete user"
routers.delete('/delete', auth, async (req, res) => {
  try {
    req.user.delete();
    res.send('user has been deleted successfully');
  } catch (error) {
    res.status(400).send(error);
  }
});

// export routers
module.exports = routers;