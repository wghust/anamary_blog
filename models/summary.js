module.exports = function(mongoose, moment, marked) {
    var cheerio = require('cheerio');
    var request = require('request');

    // cat schema
    var summaryCatSchema = new mongoose.Schema({
        cattype: {
            typeid: Number,
            typename: String
        },
        catname: {
            type: String
        },
        catdesc: {
            type: String
        },
        catbg: {
            type: String
        }
    });
    var summaryCat = mongoose.model('summary', summaryCatSchema);

    // one schema
    var summarySchema = new mongoose.Schema({
        catid: {
            type: String
        },
        sname: {
            type: String
        },
        sdesc: {
            type: String
        },
        scontent: {
            type: String
        },
        // 0 链接 1 文章
        stype: {
            type: Number
        },
        surl: {
            type: String
        },
        sdate: {
            type: String
        },
        swant: {
            type: Number,
            default: 0
        }
    });
    var summary = mongoose.model('onesummary', summarySchema);

    // 添加栏目
    var addSummaryCat = function(cat, callback) {
        var newCat = new summaryCat({
            cattype: cat.cattype,
            catname: cat.catname,
            catdesc: cat.catdesc,
            catbg: cat.catbg
        });
        newCat.save(function(err) {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    };

    // 
    var getSummaryCat = function(index, pageSize, callback) {
        summaryCat.find({

        }).sort({
            _id: 'desc'
        }).skip(index * pageSize).limit(pageSize).exec(function(err, results) {
            callback(err, results);
        });
    };

    var getSummaryNum = function(cats, callback) {
        var catPagesNums = [];
        for (var i = 0; i < cats.length; i++) {
            var oneCat = {
                catid: cats[i]._id,
                num: 0
            };
            catPagesNums.push(oneCat);
        }
        summary.find().exec(function(err, results) {
            for (var j = 0; j < results.length; j++) {
                var thisOne = results[j];
                for (var k = 0; k < catPagesNums.length; k++) {
                    if (thisOne.catid.toString() === catPagesNums[k].catid.toString()) {
                        catPagesNums[k].num += 1;
                        break;
                    }
                }
            }
            callback(catPagesNums);
        });
    };

    var getCatSum = function(pageSize, callback) {
        summaryCat.find().count(function(err, count) {
            var pageNum = Math.ceil(count / pageSize);
            callback(pageNum);
        });
    };

    // 获取一个js
    var getOneSummaryCat = function(_id, callback) {
        summaryCat.findOne({
            _id: _id
        }).exec(function(err, result) {
            callback(err, result);
        });
    };

    var getOneCatAllSummary = function(_catid, callback) {
        summary.find({
            catid: _catid
        }).sort({
            _id: -1
        }).exec(function(err, results) {
            if (err) {
                callback(null, 0);
            } else {
                if (results.length == 0) {
                    callback(null, 0);
                } else {
                    callback(results, 1);
                }
            }
        });
    };

    var getPageName = function(url, callback) {
        var state = 0;
        var title = "";
        request(url, function(err, response, body) {
            if (!err && response.statusCode == 200) {
                state = 1;
                var $ = cheerio.load(body);
                title = $("title").text();
            } else {
                state = 0;
            }
            callback(state, title);
        });
    };

    var addOneLink = function(_catid, onelink, callback) {
        getPageName(onelink.url, function(state, title) {
            var thisDate = moment().format("YYYY-MM-DD");
            var newLink = new summary({
                catid: _catid,
                sname: title,
                sdesc: onelink.desc,
                stype: 0,
                surl: onelink.url,
                sdate: thisDate
            });
            newLink.save(function(err) {
                if (err) {
                    callback(null, 0);
                } else {
                    callback(newLink, 1);
                }
            });
        });
    };

    var addOneWant = function(_id, callback) {
        summary.update({
            _id: _id
        }, {
            $inc: {
                swant: 1
            }
        }).exec(function(err) {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    };


    // var addSummary = function() {
    // 	summary.
    // };

    return {
        addSummaryCat: addSummaryCat,
        getSummaryCat: getSummaryCat,
        getCatSum: getCatSum,
        getOneCatAllSummary: getOneCatAllSummary,
        getOneSummaryCat: getOneSummaryCat,
        addOneLink: addOneLink,
        getSummaryNum: getSummaryNum,
        addOneWant: addOneWant
    };
};