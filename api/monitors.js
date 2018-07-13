const monitors = require('express').Router();
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = mongoose.Schema({
  monitor: {type: String, trim: true, required: true},
});
schema.plugin(uniqueValidator);
const Monitor = mongoose.model('Monitors', schema);

monitors.get('/', (req, res, next) => {
  Monitor.find({}, {__v: 0}, (err, data) => {
    if(err) return next(err);

    res.send(data);
  });
});
monitors.post('/', (req, res, next) => {
  // Add data to database
  const monitor = new Monitor(req.body);
  monitor.save(err => {
    if(err) return next(err);

    // Remove version
    const data = {...monitor}._doc;
    delete data.__v;

    res.status(201).send(data);
  });
});
monitors.delete('/:id', (req, res,next) => {
  // Remove document from collection
  Monitor.findOneAndRemove({_id: req.params.id}, (err, resp) => {
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
monitors.put('/:id', (req, res, next) => {
  // Delete id from body before feeding to db
  delete req.body._id;

  Monitor.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true, context: 'query'}, (err, data) => {
    if(err) return next(err);

    // Delete version key
    data = {...data}._doc;
    delete data.__v;

    res.send(data);
  });
});

module.exports = monitors;