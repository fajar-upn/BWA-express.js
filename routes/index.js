var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.redirect('/admin/login') //don't forget, change direct to '/admin/login'
});

module.exports = router;
