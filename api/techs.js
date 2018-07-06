const techs = require('express').Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    required: true
  },
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  mustChangePassword: {type: Boolean}
});
schema.plugin(uniqueValidator);
schema.pre('findOneAndUpdate', function(next){
  this.options.runValidators = true;
  next();
});
const Tech = mongoose.model('Techs', schema);

techs.get('/', (req, res, next) => {
  // Get techs from DB
  Tech.find({}, {_id: 0, __v: 0, hash: 0, mustChangePassword: 0}, (err, data) => {
    if(err) return next(err);

    res.send(data);
  });
});
techs.post('/', (req, res, next) => {
  // Hash username for password
  bcrypt.hash(req.body.username, 10, (err, hash) => {
    if(err) return next(err);

    // Save tech to database
    const tech = new Tech({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      hash: hash,
      mustChangePassword: true
    });

    tech.save(err => {
      if(err) return next(err);

      // Remove database specific data and hash
      const data = {...tech}._doc;
      delete data._id;
      delete data.__v;
      delete data.hash;
      delete data.mustChangePassword;

      res.status(201).send(data);
    });
  });
});

module.exports = techs;