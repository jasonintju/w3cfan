var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var engine = require('ejs-mate');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var User = require('./models/User');

var app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', './views');
// app.set('view cache', false);

app.use('/public', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}));

// 处理 cookie
app.use(cookieParser());

// 判断是否是管理员
app.use((req, res, next) => {
  req.userInfo = {};
  if (req.cookies.userInfo) {
    req.userInfo = req.cookies.userInfo;
    User.findById(req.userInfo.userId).then((userInfo) => {
      req.userInfo.isAdmin = userInfo.isAdmin;
      next();
    })
  } else {
    next();
  }

});

app.use('/', require('./routers/main'));
app.use('/api', require('./routers/api'));
app.use('/admin', require('./routers/admin'));
app.use('/sub/articles', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'sub-catalog', 'better-learning.html'));
});


mongoose.connect('mongodb://127.0.0.1:27017/blog', (err) => {
  if (err) {
    console.log('连接数据库失败')
  } else {
    console.log('连接数据库成功')
    app.listen(8088, () => {
      console.log('App is running on port 8088');
    });
  }
});
