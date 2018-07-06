const chokidar = require('chokidar');
const express = require('express');

const app = express();
const watcher = chokidar.watch('./api');

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

app.use((req, res, next) => {
  require('./api')(req, res, next);
});

app.listen(8080, () => console.log('API server listening'));