$(function() {
  // 立即注册链接
  $('.go-to-register').click(function() {
    $('.login').hide();
    $('.register').show();
  })
  // 立即登录链接
  $('.go-to-login').click(function() {
    $('.register').hide();
    $('.login').show();
  })
  // 登录
  $('.btn-login').click(function() {
    $.ajax({
      type: 'post',
      url: '/api/user/login',
      data: {
        username: $('#login-username').val(),
        password: $('#login-password').val()
      },
      dataType: 'json',
      success: function(data) {
        if (!data.code) {
          window.location.reload();
        } else {
          $('.login-info-tip').html(data.message);
        }
      }
    })
  })
  // 注册
  $('.btn-register').click(function() {
    $.ajax({
      type: 'post',
      url: '/api/user/register',
      data: {
        username: $('#register-username').val(),
        password: $('#register-password').val(),
        repassword: $('#re-password').val()
      },
      dataType: 'json',
      success: function(data) {
        console.log(data);
        if (!data.code) {
          $('.register').hide();
          $('.login').show();
        } else {
          $('.register-info-tip').html(data.message);
        }

      }
    })
  })
  // 退出
  $('.logout').click(function() {
    $.ajax({
      type: 'get',
      url: '/api/user/logout',
      success: function(data) {
        if(!data.code) {
          window.location.reload();
        }
      }
    })
  })
})
