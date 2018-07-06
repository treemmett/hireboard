const router = require('express').Router();

router.all('*', (req, res) => {
  res.send('Hello there');
});

module.exports = router;