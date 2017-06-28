var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  // 分类字段，是个关联字段，设置为一个引用
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },

  // 标题
  title: String,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  addTime: {
    type: Date,
    default: ''
  },

  PV: {
    type: Number,
    default: 0
  },

  summary: String,

  content: String
})
