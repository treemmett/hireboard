const hires = require('express').Router();
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = mongoose.Schema({
  name: {type: String, trim: true, required: true},
  ref: {type: String, trim: true, required: true},
  location: {type: String, trim: true},
  system: {type: String, trim: true},
  monitors: {type: String, trim: true},
  manager: {type: String, trim: true},
  assigned: {type: String, trim: true},
  accountSetup: {type: Boolean},
  hardwareDeployed: {type: Boolean},
});
schema.plugin(uniqueValidator);
const Hire = mongoose.model('Hires', schema);

hires.get('/', (req, res, next) => {
  Hire.find({}, {__v: 0}, (err, data) => {
    if(err) return next(err);

    res.send(data);
  });
});
hires.post('/', (req, res, next) => {
  // Add data to database
  const hire = new Hire(req.body);
  hire.save(err => {
    if(err) return next(err);

    // Remove version
    const data = {...hire}._doc;
    delete data.__v;

    res.status(201).send(data);
  });
});

hires.put('/:id', (req, res, next) => {
  // Delete id from body before feeding to db
  delete req.body._id;

  Hire.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true, context: 'query'}, (err, data) => {
    if(err) return next(err);

    // Delete version key
    data = {...data}._doc;
    delete data.__v;

    res.send(data);
  });
});

module.exports = hires;