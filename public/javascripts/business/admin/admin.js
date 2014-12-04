$(document).ready(function() {
    init = function() {
        // 登录
        $(".admin_login").click(function() {
            var email = $(".admin_email").val();
            var password = $(".admin_password").val();
            var str = "";
            var isOK = true;
            if (email.length < 1 || null == email) {
                str += "邮箱太短或者为空<br>";
                isOK = false;
            }
            if (password.length < 1 || null == password) {
                str += "密码太短或者为空";
                isOK = false;
            }
            if (isOK) {
                str = "登陆中。。。";
                $(".msg").show().html(str);
                var data = {
                    'email': email,
                    'password': password
                };
                $.ajax({
                    type: 'POST',
                    url: '/admin/login',
                    data: data,
                    dataType: 'json',
                    success: function(data) {
                        if (data.state) {
                            $(".msg").show().html(data.msg);
                            // window.location.href = '/';
                            redirctUrl("/index", 2000);
                        } else {
                            $(".msg").show().html(data.msg);
                        }
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            }
        });

        // 注册
        $(".admin_register").click(function() {
            var email = $(".admin_email").val();
            var username = $(".admin_username").val();
            var password = $(".admin_password").val();
            var str = "";
            var isOK = true;
            var emailreg = "^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$";
            if (email.length < 1 || null == email || !emailreg.test(email)) {
                str += "邮箱太短或者为空或者错误<br>";
                isOK = false;
            }
            if (username.length < 1 || null == username) {
                str += "用户名太短或者为空<br>";
                isOK = false;
            }
            if (password.length < 1 || null == password) {
                str += "密码太短或者为空<br>";
                isOK = false;
            }
            if (isOK) {
                str = "注册中...";
                $(".msg").show().html(str);
                var data = {
                    'email': email,
                    'username': username,
                    'password': password
                };
                $.ajax({
                    type: 'POST',
                    url: '/admin/register',
                    data: data,
                    dataType: 'json',
                    success: function(data) {
                        if (data.state) {
                            $(".msg").show().html(data.msg);
                            redirctUrl("/admin/login", 2000);
                        } else {
                            $(".msg").show().html(data.msg);
                        }
                    },
                    error: function(err) {}
                })
            } else {
                $(".msg").show().html(str);
            }
        });
    };
    var redirctUrl = function(url, time) {
        setTimeout(function() {
            // $("body").load(url);
            window.location.href = url;
        }, time);
    };
    init();
});