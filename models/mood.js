module.exports = function(config, mongoose, pinyin, moment, marked) {

    // mood mongodb init
    var moodSchema = new mongoose.Schema({
        author: {
            type: String
        },
        date: {
            type: Date
        },
        urltitle: {
            type: String
        },
        content: {
            type: String
        }
    });
    var mood = mongoose.model('mood', moodSchema);
    var default_mood = 5;
    // var moodType = {
    //     "开心": ['开心','']
    // };

    //save
    var mood_save = function(t_mood, callback) {
        var thistitle = t_mood.content.substring(0, 4).replace("'", "");
        thistitle = pinyin(thistitle, {
            style: pinyin.STYLE_NORMAL
        });
        t_mood.urltitle = "";
        for (i = 0; i < thistitle.length; i++) {
            if (i == 0) {
                t_mood.urltitle = thistitle[i];
            } else {
                t_mood.urltitle += "-" + thistitle[i];
            }
        }
        mood.find({
            urltitle: t_mood.urltitle
        }, function(err, results) {
            if (results.length != 0) {
                t_mood.urltitle = t_mood.urltitle + "-" + (results.length + 1);
            }
            var m_mood = new mood({
                'author': t_mood.author,
                'date': t_mood.date,
                'urltitle': t_mood.urltitle,
                'content': t_mood.content
            });
            m_mood.save(function(err) {
                if (err) {
                    callback(err, 1);
                } else {
                    callback(err, 0);
                }
            });
        });
    };

    // mood list
    var mood_list = function(num, callback) {
        mood.find().sort({
            '_id': -1
        }).skip(num * default_mood).limit(default_mood).exec(function(err, results) {
            if (err) {
                callback(err, null);
            } else {
                var back = new Array();
                results.forEach(function(one, index) {
                    var b = {
                        author: one.author,
                        date: moment(one.date).format('YYYY-MM-DD'),
                        urltitle: one.urltitle,
                        content: one.content,
                    };
                    back.push(b);
                });
                // console.log(back);
                callback(err, back);
            }
        });
    };

    // one mood
    var one_mood = function(urltitle, callback) {
        mood.find({
            urltitle: urltitle
        }, function(err, results) {
            if (err) {
                callback(err, null);
            } else {
                var b = results[0];
                var back = {
                    author: b.author,
                    date: moment(b.date).format('YYYY-MM-DD'),
                    urltitle: b.urltitle,
                    content: b.content
                };
                callback(err, back);
            }
        });
    };
    return {
        mood_save: mood_save,
        mood_list: mood_list,
        one_mood: one_mood
    }
};