const bodyparser = require('body-parser');
const chokidar = require('chokidar');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const watcher = chokidar.watch('./api');

// Configure app settings
app.use(express.json());
app.use(bodyparser.json());

watcher.on('ready', () => {
  watcher.on('all', () => {
    console.log('Restarting API...');
    Object.keys(require.cache).forEach(id => {
      if(/[\/\\]api[\/\\]/.test(id)){
        delete require.cache[id];
      }
    });
    console.log('API server listening');
  });
});

// Connect to database
const url = 'mongodb://localhost:27017/hireboard';
mongoose.connect(url, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  require('./api/ws');
  // Start server once connected
  app.use('/api', require('./api'));
  app.listen(8080, () => console.log('API server listening'));
});