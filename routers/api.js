'use strict';

let express = require('express');
let router = express.Router();
let User = require('../models/User');

// 统一返回数据格式
let responseData;
router.use( (req, res, next) => {
  responseData = {
    code: 0,
    message: ''
  };
  next();
})

router.post('/user/register', (req, res) => {
  let username = req.body.username,
      password = req.body.password,
      repassword = req.body.repassword;

  // 用户名不能为空
  if (!username) {
    responseData.code = 1;
    responseData.message = '用户名不能为空！';
    res.json(responseData);
    return;
  }

  // 密码不能为空
  if (!password) {
    responseData.code = 2;
    responseData.message = '密码不能为空！';
    res.json(responseData);
    return;
  }

  // 两次输入密码不一致
  if (password !== repassword) {
    responseData.code = 3;
    responseData.message = '两次输入密码不一致！';
    res.json(responseData);
    return;
  }

  // 用户名是否已经被注册
  User.findOne({
    username: username
  }).then( (userInfo) => {
    if (userInfo) {
      // 表示数据库中已有该用户名
      responseData.code = 4;
      responseData.message = '该用户名已被注册！';
      res.json(responseData);
      return;
    }
    // 保存用户信息到数据库
    var user = new User({
      username: username,
      password: password
    });
    return user.save();
  }).then(function(userInfo) {
    responseData.message = '注册成功！';
    res.json(responseData);
  });
});

router.post('/user/login', (req, res) => {
  let username = req.body.username,
      password = req.body.password;

  if (!username || !password) {
    responseData.code = 4;
    responseData.message = '用户名和密码不能为空！';
    res.json(responseData);
    return;
  }

  User.findOne({
    username: username,
    password: password
  }).then( (userInfo) => {
    if (!userInfo) {
      responseData.code = 2;
      responseData.message = '用户名或密码错误！';
      res.json(responseData);
      return;
    } else {
      responseData.userInfo = {
        userId: userInfo._id,
        userName: userInfo.username
      };
      res.cookie('userInfo', {
        userId: userInfo._id,
        userName: userInfo.username
      }, { httpOnly: true })
      responseData.message = '登录成功！';
      res.json(responseData);
    }
  })
})

router.get('/user/logout', (req, res) => {
  res.clearCookie('userInfo');
  responseData.message = '退出成功';
  res.json(responseData);
})

module.exports = router;
