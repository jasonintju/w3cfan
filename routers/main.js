var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');

router.get('/', (req, res, next) => {
  var categories, where = {};
  var category = req.query.category;
  if (category) {
    where.category = category;
  }
  Category.find().then((cates) => {
    categories = cates;
    return Content.where(where).find().populate(['category', 'user']).sort({
      addTime: -1
    });
  }).then((contents) => {
    res.render('index', {
      userInfo: req.userInfo,
      categories: categories,
      contents: contents,
      category: category
    });
  })
})

module.exports = router;
