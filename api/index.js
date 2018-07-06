const router = require('express').Router();

router.use('/login', require('./login'));
router.use('/techs', require('./techs').route);

router.use(require('./errorHandler'));
module.exports = router;