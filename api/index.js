const router = require('express').Router();
const jwt = require('express-jwt');

// Don't crash on exceptions
process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

// Require a valid token
router.use(jwt({
  secret: 'mySecret'
}).unless({
  path: [
    /\/api\/login\/?$/
  ]
}));

router.use('/login', require('./login'));
router.use('/hires', require('./hires'));
router.use('/techs', require('./techs').route);

router.use(require('./errorHandler'));
module.exports = router;