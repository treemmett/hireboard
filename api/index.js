const router = require('express').Router();
const jwt = require('express-jwt');

// Require a valid token
router.use(jwt({
  secret: 'mySecret'
}).unless({
  path: [
    /\/api\/login\/?$/
  ]
}));

router.use('/login', require('./login'));
router.use('/techs', require('./techs').route);

router.use(require('./errorHandler'));
module.exports = router;