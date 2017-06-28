'use strict';

let express = require('express');
let router = express.Router();
let User = require('../models/User');
let Category = require('../models/Category');
let Content = require('../models/Content');

router.use((req, res, next) => {
  if (!req.userInfo.isAdmin) {
    res.send('只有管理员有权限进入该页面');
    return;
  }
  next();
})

// 统一返回数据格式
let data;
router.use( (req, res, next) => {
  data = {
    code: 0,
    msg: ''
  };
  next();
})

router.get('/', (req, res) => {
  res.render('back/index', {
    userInfo: req.userInfo
  })
})

router.get('/user', (req, res) => {
  User.find().then((users) => {
    res.render('back/user', {
      userInfo: req.userInfo,
      users: users
    })
  })
})

router.get('/category', (req, res) => {
  Category.find().sort({_id: -1}).then((categories) => {
    res.render('back/category', {
      userInfo: req.userInfo,
      categories: categories
    })
  })
})

router.get('/category/add', (req, res) => {
  res.render('back/category-add', {
    userInfo: req.userInfo
  })
})

router.post('/category/add', (req, res) => {
  var name = req.body.name || '';
  if (!name) {
    data.code = 1;
    data.msg = '分类名称不能为空';
    res.json(data);
    return;
  }

  Category.findOne({
    name: name
  }).then((rs) => {
    if (rs) {
      data.code = 2;
      data.msg = '已存在该分类名称';
      res.json(data);
      return;
    } else {
      new Category({
        name: name
      }).save();
      data.msg = '添加成功';
      res.json(data);
    }
  })
})

router.get('/category/edit', (req, res) => {
  var id = req.query.id;
  console.log(id)
  Category.findOne({
    _id: id
  }).then((rs) => {
    if (!rs) {
      data.code = 1;
      data.msg = '分类名称不存在';
      res.json(data);
      return;
    }
    res.render('back/category-edit', {
      userInfo: req.userInfo,
      category: rs.name,
      id: id
    })
  })
})

router.post('/category/edit', (req, res) => {
  var id = req.query.id,
      name = req.body.name;
  Category.findOne({
    _id: id
  }).then((rs) => {
    if (!rs) {
      data.code = 1;
      data.msg = '分类名称不存在';
      res.json(data);
      return;
    }
    if (name == rs.name) {
      data.msg = '修改成功';
      res.json(data);
    } else {
      Category.findOne({
        name: name
      }).then((rs) => {
        if (rs) {
          data.code = 1;
          data.msg = '数据库中已存在该分类名称';
          res.json(data);
          return Promise.reject();
        } else {
          return Category.update({ _id: id },{ name: name })
        }
      }).then((rs) => {
        data.msg = '修改成功';
        res.json(data);
      });
    }
  })
})

router.get('/category/delete', (req, res) => {
  var id = req.query.id;
  Category.remove({
    _id: id
  }).then(() => {
    data.msg = '删除成功';
    res.json(data);
  })
})

router.get('/content', (req, res) => {
  Content.find().sort({_id: -1}).populate(['category', 'user']).then((contents) => {
    res.render('back/content', {
      userInfo: req.userInfo,
      contents: contents
    })
  })
})

router.get('/content/add', (req, res) => {
  Category.find().sort({_id: -1}).then((categories) => {
    res.render('back/content-add', {
      userInfo: req.userInfo,
      categories: categories
    })
  })
})

router.post('/content/add', (req, res) => {
  new Content({
    category: req.body.category,
    title: req.body.title,
    user: req.userInfo.userId,
    summary: req.body.summary,
    content: req.body.content,
    addTime: Date.now()
  }).save().then((rs) => {
    data.msg = '内容保存成功';
    res.json(data);
  })
})

router.get('/content/edit', (req, res) => {
  var id = req.query.id;
  var categories = [];
  Category.find().then((rs) => {
    categories = rs;
    return Content.findOne({
      _id: id
    })
  }).then((rs) => {
    if (!rs) {
      data.code = 1;
      data.msg = '文章不存在';
      return Promise.reject();
    } else {
      res.render('back/content-edit', {
        userInfo: req.userInfo,
        content: rs,
        categories: categories
      })
    }
  })
})

router.post('/content/edit', (req, res) => {
  var id = req.query.id;
  Content.update({_id: id}, {
    category: req.body.category,
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content
  }).then((rs) => {
    data.msg = '修改成功';
    res.json(data);
  })
})

router.get('/content/delete', (req, res) => {
  var id = req.query.id;
  Content.remove({
    _id: id
  }).then(() => {
    data.msg = '删除成功';
    res.json(data);
  })
})

module.exports = router;
