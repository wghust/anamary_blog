// search
module.exports = function(mongoose, pinyin, moment, marked) {
    // 配置搜索
    var m = {
        article: mongoose.model("article"),
        mood: mongoose.model("mood")
    };


    // 搜索标签
    search_article = function(sword, callback) {
        m.article.find({
            state: 0
        }).exec(function(err, articles) {
            var rightpage = new Array();
            articles.forEach(function(article, index) {
                if (index < 15) {
                    var isthispage = 0;
                    if (article.title.toLowerCase().indexOf(sword.toLowerCase()) != -1 || sword.toLowerCase().indexOf(article.title.toLowerCase()) != -1) {
                        isthispage = 1;
                    }
                    if (isthispage == 0) {
                        var thistags = article.tags.split(',');
                        thistags.forEach(function(tag, index) {
                            if (tag.toLowerCase().indexOf(sword.toLowerCase()) != -1 || sword.toLowerCase().indexOf(tag.toLowerCase()) != -1) {
                                isthispage = 1;
                                return;
                            }
                        });
                    }
                    if (isthispage == 1) {
                        var back = {
                            title: article.title,
                            urltitle: article.urltitle,
                            tags: article.tags,
                            author: article.author,
                            date: moment(article.date).format('YYYY-MM-DD'),
                            content: marked(article.content.substring(0, 100)),
                        }
                        rightpage.push(back);
                        // console.log(article);
                    }
                } else {
                    return;
                }
            });
            callback(err, rightpage);
        });
    };

    // 搜索心情
    search_mood = function(sword, callback) {
        m.mood.find({

        }).exec(function(err, moods) {
            var rightmood = new Array();
            moods.forEach(function(mood, index) {
                if (index < 5) {
                    var isthismood = 0;
                    if (mood.content.toLowerCase().indexOf(sword.toLowerCase()) != -1 || sword.toLowerCase().indexOf(mood.content.toLowerCase()) != -1) {
                        isthismood = 1;
                    }
                    if (isthismood) {
                        var back = {
                            content: mood.content,
                            urltitle: mood.urltitle,
                            date: moment(mood.date).format('YYYY-MM-DD')
                        };
                        rightmood.push(back);
                    }
                } else {
                    return;
                }
            });
            callback(err, rightmood);
        });
    };

    // 搜索入口
    init_search = function(sword, callback) {
        var results = new Array();
        search_article(sword, function(err, back) {
            results.push(back);
            search_mood(sword, function(err, mback) {
                results.push(mback);
                callback(null, results);
            });
        });
    };

    // 调用函数
    return {
        search_article: search_article,
        search_mood: search_mood,
        init_search: init_search
    };
};