const systems = require('express').Router();
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = mongoose.Schema({
  system: {type: String, trim: true, required: true},
});
schema.plugin(uniqueValidator);
const System = mongoose.model('Systems', schema);

systems.get('/', (req, res, next) => {
  System.find({}, {__v: 0}, (err, data) => {
    if(err) return next(err);

    res.send(data);
  });
});
systems.post('/', (req, res, next) => {
  // Add data to database
  const system = new System(req.body);
  system.save(err => {
    if(err) return next(err);

    // Remove version
    const data = {...system}._doc;
    delete data.__v;

    res.status(201).send(data);
  });
});
systems.delete('/:id', (req, res,next) => {
  // Remove document from collection
  System.findOneAndRemove({_id: req.params.id}, (err, resp) => {
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
systems.put('/:id', (req, res, next) => {
  // Delete id from body before feeding to db
  delete req.body._id;

  System.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true, context: 'query'}, (err, data) => {
    if(err) return next(err);

    // Delete version key
    data = {...data}._doc;
    delete data.__v;

    res.send(data);
  });
});

module.exports = systems;