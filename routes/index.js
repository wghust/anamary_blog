var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var markdown = require('markdown').markdown;
var nodemailer = require('nodemailer');
var pinyin = require('pinyin');
var fs = require('fs');
mongoose.connect("mongodb://localhost/blog", function onMongooseError(err) {
    if (err)
        throw err;
});
var config = {
    mail: require('../config/config')
};
var models = {
    Account: require('../models/account.js')(config, mongoose, nodemailer),
    Ch_to_en: require('../models/ch_to_en.js')(pinyin)
};
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Anamary'
    });
});
// page页
router.get('/page', function(req, res) {
    res.render('page', {
        title: 'page'
    });
});
router.get('/page/:id', function(req, res) {
    res.render('page', {
        title: 'page'
    });
});
router.get('/blog/:title', function(req, res) {
    var path = ['../pages/', req.params.title, '.md'].join('');
    console.log(path);
    fs.readFile(path, 'utf-8', function(err, str) {
        if (err) {
            return err;
        } else {
            str = markdown.toHTML(str);
            res.render('blog', {
                title: 'blog',
                content: str
            });
        }
    });
});
// tags页
router.get('/tags', function(req, res) {
    res.render('tags', {
        title: 'TAGS'
    });
});
// markdown
router.get('/markdown', function(req, res) {
    // var html = markdown.toHTML("[TECCLASS](http://tecclass.cn)");
    res.render('markdown', {
        // content: html
        title: 'markdown'
    });
});
// mood list
router.get('/moodlist', function(req, res) {
    res.render('moodlist', {
        'title': 'mood'
    });
});

// admin
router.get('/admin/login', function(req, res) {
    if (req.session.loggedIn) {
        res.redirect('../');
    }
    res.render('login', {
        'title': 'login'
    });
});
router.post('/admin/login', function(req, res) {
    console.log("login request");
    var email = req.param('email', null);
    var password = req.param('password', null);
    var back;
    if (null == email || email.length < 1 || null == password || password.length < 1) {
        back = {
            msg: "较短或者为空",
            state: 0
        }
        res.end(JSON.stringify(back));
        return;
    }
    models.Account.login(email, password, function(account) {
        if (!account) {
            back = {
                msg: "用户不存在",
                state: 0
            };
            res.end(JSON.stringify(back));
            return;
        }
        console.log('login is successful');
        req.session.loggedIn = true;
        // req.session.accountId = account._id;
        req.session.user = account;
        back = {
            msg: "登录成功",
            state: 1
        };
        res.end(JSON.stringify(back));
        return;
    });
});

router.get('/admin/register', function(req, res) {
    if (req.session.loggedIn) {
        res.redirect('../');
    }
    res.render('register', {
        'title': 'register'
    });
});
router.post('/admin/register', function(req, res) {
    console.log("register request");
    var email = req.param('email');
    var username = req.param('username');
    var password = req.param('password');
    console.log(username);
    var back;
    if (null == email || email.length < 1 || null == password || password.length < 1 || null == username || username.length < 1) {
        back = {
            msg: '较短或者为空',
            state: 0
        };
        res.end(JSON.stringify(back));
        return;
    }
    models.Account.register(email, password, username, function(msg, state) {
        back = {
            msg: msg,
            state: state
        };
        res.end(JSON.stringify(back));
        return;
    });
});
router.get('/logout', function(req, res) {
    console.log('log out request');
    req.session.loggedIn = null;
    req.session.user = null;
    // res.locals.user = null;
    // res.locals.loggedIn = null;
    console.log(res.locals.user);
    res.render('logout', {
        'title': 'logout'
    });
});
router.get('/admin/write', function(req, res) {
    console.log("write request");
    res.render('write', {
        'title': 'write'
    });
});
// 404
router.get('*', function(req, res) {
    res.render('404', {
        'title': '404'
    });
})
module.exports = router;