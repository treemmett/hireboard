const router = require('express').Router();

router.use('/techs', require('./techs'));

router.use(require('./errorHandler'));
module.exports = router;