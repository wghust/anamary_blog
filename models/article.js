module.exports = function(config, mongoose, pinyin, moment, marked) {
    var articleSchema = new mongoose.Schema({
        title: {
            type: String
        },
        urltitle: {
            type: String
        },
        cats: {
            type: String
        },
        content: {
            type: String
        },
        tags: {
            type: String
        },
        author: {
            type: String
        },
        state: {
            type: Number
        },
        view: {
            type: Number,
            default: 0
        },
        date: {
            type: Date
        }
    });
    var article = mongoose.model('article', articleSchema);
    var default_num = 5;
    // 保存文档
    var article_save = function(data, callback) {
        article.find({
            title: data.title
        }, function(err, results) {
            var btitle = pinyin(data.title, {
                style: pinyin.STYLE_NORMAL
            });
            for (i = 0; i < btitle.length; i++) {
                if (i == 0) {
                    data.urltitle = btitle[i];
                } else {
                    data.urltitle += "-" + btitle[i];
                }
            }
            if (results.length != 0) {
                data.urltitle = data.urltitle + "-" + (results.length + 1)
            }
            var newdata = new article({
                'title': data.title,
                'urltitle': data.urltitle,
                'cats': data.cats,
                'content': data.content,
                'tags': data.tags,
                'author': data.author,
                'state': data.state,
                'date': data.date
            });
            // console.log(data);
            newdata.save(function(err) {
                if (err) {
                    callback(err, 0);
                } else {
                    callback(err, 1);
                }
            });
        });
    };

    // 查询某一列表的文章
    var get_cat_page = function(catname, callback) {
        article.find({
            cats: {
                $regex: catname,
                $options: "i"
            },
            state: 0
        }, function(err, results) {
            if (err) {
                callback(0, null);
            } else {
                var back = new Array();
                // console.log()
                results.forEach(function(one, index) {
                    var d = one.date;
                    var b = {
                        title: one.title,
                        urltitle: one.urltitle,
                        date: moment(d).format('YYYY-MM-DD'),
                        cats: one.cats,
                        tags: one.tags,
                        author: one.author
                    };
                    back.push(b);
                });
                callback(1, back);
            }
        });
    };

    // 获取其中一篇文章
    var get_one_page = function(type, urltitle, callback) {
        if (type != -1) {
            article.find({
                urltitle: urltitle,
                state: type
            }).exec(function(err, results) {
                if (results.length == 0) {
                    callback(0, null);
                } else {
                    // console.log(results[0].view);
                    article.update({
                        urltitle: urltitle
                    }, {
                        $inc: {
                            view: 1
                        }
                    }, function(err) {});
                    var r = results[0];
                    console.log(r.view);
                    var c = [];
                    if (r.tags) {
                        c = r.tags.split(',');
                    }
                    // console.log(c);
                    var b = {
                        title: r.title,
                        urltitle: r.urltitle,
                        date: moment(r.date).format('YYYY-MM-DD'),
                        cats: r.cats,
                        tags: c,
                        content: r.content,
                        author: r.author,
                        view: r.view,
                        state: r.state
                    };
                    callback(1, b);
                }
            });
        } else {
            article.find({
                urltitle: urltitle
            }).exec(function(err, results) {
                if (results.length == 0) {
                    callback(0, null);
                } else {
                    // console.log(results[0].view);
                    article.update({
                        urltitle: urltitle
                    }, {
                        $inc: {
                            view: 1
                        }
                    }, function(err) {});
                    var r = results[0];
                    console.log(r.view);
                    var c = [];
                    if (r.tags) {
                        c = r.tags.split(',');
                    }
                    // console.log(c);
                    var b = {
                        title: r.title,
                        urltitle: r.urltitle,
                        date: moment(r.date).format('YYYY-MM-DD'),
                        cats: r.cats,
                        tags: c,
                        content: r.content,
                        author: r.author,
                        view: r.view,
                        state: r.state
                    };
                    callback(1, b);
                }
            });
        }

    };

    // 获取标签文章
    var get_tag_pagelist = function(tag, callback) {
        article.find({
            tags: {
                $regex: tag,
                $options: "i"
            },
            state: 0
        }, function(err, results) {
            if (err) {
                callback(0, null);
            } else {
                var back = new Array();
                // console.log()
                results.forEach(function(one, index) {
                    var t = one.tags.split(',');
                    var t_is = false;
                    for (i = 0; i < t.length; i++) {
                        if (t[i] === tag) {
                            t_is = true;
                            break;
                        }
                    }
                    if (t_is) {
                        var d = one.date;
                        var b = {
                            title: one.title,
                            urltitle: one.urltitle,
                            date: moment(d).format('YYYY-MM-DD'),
                            cats: one.cats,
                            tags: one.tags,
                            author: one.author
                        };
                        back.push(b);
                    }
                });
                callback(1, back);
            }
        });
    };

    // 获取某类型的文章
    /**
     * 0 发布
     * 1 草稿
     * 2 隐私
     * -1 所有
     */
    var get_allpage_num = function(type, callback) {
        if (type != -1) {
            article.find({
                state: type
            }).count(function(err, count) {
                // console.log(count);
                thiscount = Math.ceil(count / default_num);
                callback(err, thiscount);
            });
        } else {
            article.find().count(function(err, count) {
                // console.log(count);
                thiscount = Math.ceil(count / default_num);
                callback(err, thiscount);
            });
        }
    }

    // 首页显示文章
    var get_index_page = function(num, callback) {
        article.find({
            state: 0
        }).sort({
            _id: -1
        }).skip(num * default_num).limit(default_num).exec(function(err, results) {
            if (err) {
                callback(0, null);
            } else {
                var back = new Array();
                // console.log(results);
                results.forEach(function(one, index) {
                    var t = [];
                    if (one.tags) {
                        t = one.tags.split(',');
                    }
                    var b = {
                        title: one.title,
                        urltitle: one.urltitle,
                        date: moment(one.date).format('YYYY-MM-DD'),
                        tags: t,
                        shortcontent: marked(one.content.substring(0, 200))
                    };
                    back.push(b);
                });
                callback(1, back);
            }
        });
    };

    // 获取所有的文章
    /**
     * 0 发布
     * 1 草稿
     * 2 隐私
     * -1 所有
     */
    var get_all_page_list = function(num, type, callback) {
        if (type != -1) {
            article.find({
                state: type
            }).sort({
                _id: -1
            }).skip(default_num * num).limit(default_num).exec(function(err, results) {
                if (err) {
                    callback(0, null);
                } else {
                    callback(1, change_article(results));
                }
            });
        } else {
            article.find().sort({
                _id: -1
            }).skip(default_num * num).limit(default_num).exec(function(err, results) {
                if (err) {
                    callback(0, null);
                } else {
                    callback(1, change_article(results));
                }
            });
        }
    };
    var change_article = function(results) {
        var back = new Array();
        results.forEach(function(one, index) {
            var t = [];
            if (one.tags) {
                t = one.tags.split(',');
            }
            var b = {
                title: one.title,
                urltitle: one.urltitle,
                cats: one.cats,
                date: moment(one.date).format('YYYY-MM-DD'),
                tags: t,
                state: one.state,
                view: one.view
            };
            back.push(b);
        });
        return back;
    };

    return {
        article_save: article_save,
        get_cat_page: get_cat_page,
        get_one_page: get_one_page,
        get_tag_pagelist: get_tag_pagelist,
        get_index_page: get_index_page,
        get_allpage_num: get_allpage_num,
        get_all_page_list: get_all_page_list
    }
};