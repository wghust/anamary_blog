module.exports = function(mongoose, pinyin, moment, marked) {

    // rank
    /**
     * rank 0: First grade
     * rank 1: Second grade
     * rank ..: the same as before
     */
    var CatSchema = new mongoose.Schema({
        uid: {
            type: Number,
            default: 0
        },
        parentuid: {
            type: Number,
            default: -1
        },
        catname: {
            type: String
        },
        description: {
            type: String,
            default: '这是一个描述'
        }
    });
    var Cat = mongoose.model('cat', CatSchema);

    // update one cat
    var update_one_cat = function(cat, callback) {
        Cat.update({
            uid: cat.uid
        }, {
            $set: {
                parentuid: cat.parentuid,
                catname: cat.catname,
                description: cat.description
            }
        }, function(err) {
            if (err) {
                callback(0);
            } else {
                callback(1);
            }
        });
    };

    // build new id
    var build_newcat_id = function(callback) {
        Cat.find().sort({
            'uid': 1
        }).exec(function(err, results) {
            if (results.length == 0) {
                callback(err, 0);
            } else {
                var _thisid = results[results.length - 1].uid + 1;
                callback(err, _thisid);
            }
        });
    };
    // set a new cat
    var set_new_cat = function(cat, callback) {
        Cat.find({
            catname: cat.catname
        }, function(err, results) {
            if (results.length == 0) {
                build_newcat_id(function(err, nowid) {
                    cat.uid = nowid;
                    var newcat = new Cat({
                        uid: cat.uid,
                        parentuid: cat.parentuid,
                        catname: cat.catname,
                        description: cat.description
                    });
                    newcat.save(function(err) {
                        if (err) {
                            callback(null, 0);
                        } else {
                            callback(cat, 1);
                        }
                    });
                });
            } else {
                callback(null, 0);
            }
        });
    };

    // 删除cat
    var delete_new_cat = function(uid, callback) {
        Cat.remove({
            'uid': uid
        }, function(err) {
            if (err) {
                callback(0);
            } else {
                callback(1);
            }
        });
    }

    // get all cat
    var get_all_cat = function(callback) {
        Cat.find(function(err, results) {
            if (results.length == 0) {
                callback(err, null);
            } else {
                callback(err, results);
            }
        });
    };

    // get index cat
    var get_index_cat = function(callback) {
        Cat.find(function(err, results) {
            if (results.length == 0) {
                callback(err, null);
            } else {
                var a;
                results.forEach(function(one, index) {
                    if (one.parentuid == -1) {
                        var b = {
                            parent: one.catname,
                            parentuid: one.uid,
                            children: []
                        };
                        a.push(b);
                    }
                });
                results.forEach(function(one, index) {
                    if (one.parentuid != -1) {
                        for (var i = 0; i < a.length; i++) {
                            if (a[i].parentuid == one.parentuid) {
                                a[i].children.push(one.catname);
                                break;
                            }
                        }
                    }
                });
            }
        });
    };

    return {
        get_all_cat: get_all_cat,
        set_new_cat: set_new_cat,
        update_one_cat: update_one_cat,
        delete_new_cat: delete_new_cat
    };
};