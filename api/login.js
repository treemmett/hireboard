const auth = require('express').Router();
const Tech = require('./techs').schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

auth.post('/', (req, res, next) => {
  // Get hash from database
  Tech.findOne({username: req.body.username}, {hash: 1}, (err, data) => {
    if(err) return next(err);

    // Throw if user doesn't exist
    if(!data || !req.body.password){
      res.status(401).send({error: ['Username or password is incorrect']});
      return;
    }

    // Compare hash
    bcrypt.compare(req.body.password, data.hash, (err, match) => {
      if(err) return next(err);
      

      if(!match){
        res.status(401).send({error: ['Username or password is incorrect']});
        return;
      }

      // Create token
      jwt.sign({username: data.username}, 'mySecret', {expiresIn: '30m'}, (err, token) => {
        if(err) return next(err);

        res.set('X-Auth-Token', token).end();
      });
    });
  });
});

module.exports = auth;