const hires = require('express').Router();
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const wss = require('./ws');

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

    // Get all hires after update
    Hire.find({}, {__v: 0}, (err, data) => {
      wss.send(JSON.stringify(data));
    });
  });
});
hires.delete('/', (req, res, next) => {
  Hire.remove({}, err => {
    if(err) return next(err);

    res.end();
  });
});
hires.delete('/:id', (req, res,next) => {
  // Remove document from collection
  Hire.findOneAndRemove({_id: req.params.id}, (err, resp) => {
    if(err) return next(err);

    // Check if nothing was deleted
    if(!resp){
      res.status(404).send({
        error: ['Item not found.']
      });
      return;
    }

    res.end();
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

    // Get all hires after update
    Hire.find({}, {__v: 0}, (err, data) => {
      wss.send(JSON.stringify(data));
    });
  });
});

wss.server.on('connection', ws => {
  Hire.find({}, {__v: 0}, (err, data) => {
    ws.send(JSON.stringify(data));
  });
});

module.exports = hires;