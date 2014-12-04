var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var markdown = require('markdown').markdown;
var marked = require('marked');
var nodemailer = require('nodemailer');
var pinyin = require('pinyin');
var fs = require('fs');
var moment = require('moment');
mongoose.connect("mongodb://localhost/blog", function onMongooseError(err) {
    if (err)
        throw err;
});

// 配置文件
var config = {
    mail: require('../config/config')
};

// 模块
var models = {
    Account: require('../models/account.js')(config, mongoose, nodemailer),
    Article: require('../models/article.js')(config, mongoose, pinyin, moment, marked),
    Mood: require('../models/mood.js')(config, mongoose, pinyin, moment, marked),
    Search: require('../models/search.js')(mongoose, pinyin, moment, marked),
    Blog: require('../models/blog.js')(mongoose, pinyin, moment, marked),
    Cat: require('../models/cat.js')(mongoose, pinyin, moment, marked)
};

/* GET home page. */
// router
router.get('/', function(req, res) {
    res.redirect('/index');
});

// index
router.get('/index', function(req, res) {
    models.Article.get_index_page(0, function(state, pagelist) {
        // article
        models.Article.get_allpage_num(0, function(err, count) {
            // mood
            models.Mood.mood_list(0, function(err, moods) {
                // console.log(moods);
                // blog ifm
                models.Blog.blog_ifm_get(function(blogifm) {
                    if (blogifm != null) {
                        // models.Cat.
                        res.render('index', {
                            title: 'Anamary',
                            pagelist: pagelist,
                            count: count,
                            nownum: 0,
                            moods: moods,
                            blogifm: blogifm
                        });
                    }
                });
            })
        });
    });
});
router.get('/index/:num', function(req, res) {
    var num = parseInt(req.param('num'));
    // console.log(num);
    models.Article.get_index_page(num, function(state, pagelist) {
        // console.log(pagelist);
        models.Article.get_allpage_num(0, function(err, count) {
            // mood
            models.Mood.mood_list(0, function(err, moods) {

                // blog ifm
                models.Blog.blog_ifm_get(function(blogifm) {
                    res.render('index', {
                        title: 'Anamary',
                        pagelist: pagelist,
                        count: count,
                        nownum: num,
                        moods: moods,
                        blogifm: blogifm
                    });
                });
            });
        });
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
router.get('/mood/:urltitle', function(req, res) {
    var urltitle = req.param('urltitle');
    var demo_image = ['winter.jpg', 'DSC_0044.JPG', 'DSC_0058.JPG', 'DSC_0117.JPG', 'DSC_0272.JPG'];
    var this_num = Math.floor(Math.random() * 5);
    var mood_image = demo_image[this_num];
    models.Mood.one_mood(urltitle, function(err, result) {
        res.render('onemood', {
            'title': 'mood',
            'mood': result,
            'mood_image': mood_image
        });
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
    models.Account.login(email, password, function(state, account) {
        if (!state) {
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
        // console.log(account);
        // console.log(req.session.user);
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

router.get('/admin/logout', function(req, res) {
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
    if (req.session.loggedIn == null) {
        res.redirect('../');
    }
    res.render('write', {
        'title': 'write'
    });
});

router.get('/admin/editpage/:urltitle', function(req, res) {
    console.log("write edit");
    if (req.session.loggedIn == null) {
        res.redirect('/index');
    }
    var urltitle = req.param('urltitle');
    models.Article.get_one_page(-1, urltitle, function(err, onearticle) {
        // console.log(onearticle);
        res.render('edit', {
            'title': 'edit',
            'article': onearticle
        });
    });
});

// 保存文章
router.post('/admin/article_save', function(req, res) {
    console.log("begin save...");
    var _thisTitle = req.param('title');
    var _thisContent = req.param('content');
    var _thisTags = req.param('tags');
    var _thiscats = req.param('cats');
    var _thisstate = req.param('state');
    var data = {
        title: _thisTitle,
        content: _thisContent,
        tags: _thisTags,
        cats: _thiscats,
        state: _thisstate
    };
    // console.log(req.session.user);
    data.author = req.session.user.username;
    data.date = moment().format();
    models.Article.article_save(data, function(err, state) {
        var back = {
            msg: "",
            state: 0
        };
        if (state == 1) {
            back.msg = "保存成功";
            back.state = 1;
        } else {
            back.msg = "保存不成功";
            back.state = 0;
        }
        res.end(JSON.stringify(back));
    });
});

// 设置
router.get('/admin/set', function(req, res) {
    console.log("set page");
    if (req.session.loggedIn == null) {
        res.redirect('../');
    }
    models.Blog.blog_ifm_get(function(blogifm) {
        // console.log(blogifm);
        // get article
        models.Article.get_all_page_list(0, -1, function(state, articlelist) {
            // console.log(articlelist);
            models.Article.get_allpage_num(-1, function(err, count) {
                models.Cat.get_all_cat(function(err, cats) {
                    res.render('set', {
                        'title': 'set',
                        'blogifm': blogifm,
                        'articlelist': articlelist,
                        'count': count,
                        'cats': cats
                    });
                });
            });
        });
    });
});
// 添加cat
router.post('/admin/insertcat', function(req, res) {
    var cat = {
        catname: req.param('catname'),
        parentuid: req.param('parentuid'),
        uid: req.param('uid'),
        description: req.param('description')
    };
    models.Cat.set_new_cat(cat, function(cat, state) {
        var back = {
            cat: cat,
            state: state
        };
        res.end(JSON.stringify(back));
    });
});
// 更新cat
router.post('/admin/updatecat', function(req, res) {
    var cat = {
        catname: req.param('catname'),
        parentuid: req.param('parentuid'),
        uid: req.param('uid'),
        description: req.param('description')
    };
    models.Cat.update_one_cat(cat, function(state) {
        var back = {
            cat: null,
            state: state
        };
        res.end(JSON.stringify(back));
    });
});
// 删除cat
router.post('/admin/catdelete', function(req, res) {
    var uid = req.param('uid');
    models.Cat.delete_new_cat(uid, function(state) {
        var back = {
            state: state
        };
        res.end(JSON.stringify(back));
    });
});

// 设置页获取文章
router.post('/admin/getotherart', function(req, res) {
    var nownum = req.param('nownum');
    models.Article.get_all_page_list(nownum, -1, function(err, articlelist) {
        res.end(JSON.stringify(articlelist));
    });
});

router.post('/admin/saveifm', function(req, res) {
    var blogname = req.param('blogname');
    var description = req.param('description');
    var newone = {
        email: req.session.user.email,
        blogname: blogname, //username
        description: description
    };
    // console.log(newone);
    models.Blog.blog_init(newone, function(state) {
        var back = {
            msg: "",
            state: ""
        };
        if (state == 1) {
            back.msg = "保存成功";
            back.state = state;
        } else {
            back.msg = "保存失败";
            back.state = state;
        }
        res.end(JSON.stringify(back));
    });
});

//类别
router.get('/cat/:catname', function(req, res) {
    var catname = req.param('catname');
    models.Article.get_cat_page(catname, function(state, results) {
        console.log(results);
        res.render('pagelist', {
            'title': 'list',
            'catname': catname,
            'pagelist': results
        });
    });
});

// page页
// router.get('/page', function(req, res) {
//     res.render('page', {
//         title: 'page',

//     });
// });
router.get('/page/:urltitle', function(req, res) {
    var urltitle = req.param('urltitle');
    models.Article.get_one_page(0, urltitle, function(state, results) {
        // console.log(results + "123");
        if (results == null) {
            res.redirect('/index');
        } else {
            results.content = marked(results.content);
            res.render('page', {
                'title': results.title,
                'onepage': results
            });
        }
    });
});

// tags页
// router.get('/tags', function(req, res) {
//     res.render('tags', {
//         title: 'TAGS'
//     });
// });
router.get('/tags/:onetag', function(req, res) {
    var tag = req.param('onetag');
    models.Article.get_tag_pagelist(tag, function(state, results) {
        res.render('tags', {
            title: 'TAGS',
            tag: tag,
            pagelist: results
        });
    });
});

// mood
router.get('/admin/mind', function(req, res) {
    if (req.session.loggedIn == null) {
        res.redirect('../');
    }
    res.render('addmood', {
        'title': 'addmood'
    });
});
router.post('/admin/mind', function(req, res) {
    console.log(req.param('content'));
    var onemood = {
        author: req.session.user.username,
        date: moment().format(),
        content: req.param('content')
    };
    // console.log(onemood);
    models.Mood.mood_save(onemood, function(err, state) {
        var back = {
            msg: "",
            state: 0
        };
        if (state) {
            back.msg = "保存失败";
            back.state = 1;
        } else {
            back.msg = "保存成功";
            back.state = 0;
        }
        res.end(JSON.stringify(back));
    });
});

// search
router.post('/search', function(req, res) {
    console.log("begin search");
    var sword = req.param('sword');
    models.Search.init_search(sword, function(err, results) {
        res.end(JSON.stringify(results));
    });
});

// 404
router.get('*', function(req, res) {
    res.render('404', {
        'title': '404'
    });
});
module.exports = router;