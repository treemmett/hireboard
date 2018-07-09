const auth = require('express').Router();
const Tech = require('./techs').schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

auth.post('/', (req, res, next) => {
  // Get hash from database
  Tech.findOne({username: req.body.username}, {hash: 1, mustChangePassword: 1}, (err, data) => {
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
      jwt.sign({username: req.body.username}, 'mySecret', {expiresIn: '30m'}, (err, token) => {
        if(err) return next(err);

        res.set('X-Auth-Token', token);

        if(data.mustChangePassword){
          res.send({mustChangePassword: true});
        }else{
          res.end();
        }
      });
    });
  });
});
auth.put('/changepassword', (req, res, next) => {
  // Hash password
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if(err) return next(err);

    // Update hash in database
    Tech.findOneAndUpdate({username: req.user.username}, {hash: hash, mustChangePassword: false}, {new: true, runValidators: true, context: 'query'}, (err, data) => {
      if(err) return next(err);
  
      // Create token
      jwt.sign({username: req.user.username}, 'mySecret', {expiresIn: '30m'}, (err, token) => {
        if(err) return next(err);

        res.set('X-Auth-Token', token).end();
      });
    });
  });
});

module.exports = auth;