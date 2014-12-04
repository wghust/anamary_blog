module.exports = function(config, mongoose, nodemailer) {
    var crypto = require("crypto");

    var AccountSchema = new mongoose.Schema({
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        username: {
            type: String
        },
        description: {
            type: String
        }
    });

    var Account = mongoose.model('Account', AccountSchema);

    // 登录
    var login = function(email, password, callback) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(password);
        Account.findOne({
            email: email,
            password: shaSum.digest('hex')
        }, function(err, doc) {
            // console.log(doc);
            // callback()
            var user = {
                email: doc.email,
                username: doc.username,
                _id: doc._id
            };
            callback(null != doc, user);

        });
    };

    // 注册
    var register = function(email, password, username, callback) {
        // console.log(email);
        var state; //0失败，1表示成功
        var msg = "";
        var shaSum = crypto.createHash('sha256');
        shaSum.update(password);
        // console.log("registering" + email);
        var user = new Account({
            email: email,
            password: shaSum.digest('hex'),
            username: username
        });
        Account.findOne({
            email: user.email,
            password: user.password
        }, function(err, doc) {
            if (null == doc) {
                user.save(function(err) {
                    if (err) {
                        console.log(err);
                        msg = "存储失败";
                        state = 0;
                        callback(msg, state);
                    } else {
                        msg = "存储成功";
                        state = 1;
                        callback(msg, state);
                    }
                });
            } else {
                msg = "用户已经存在";
                state = 0;
                callback(msg, state);
            }
        });
    };
    // var update_user = function(newone, callback) {
    //     Account.update({
    //         email: newone.email
    //     }, {
    //         $set: {
    //             username: newone.username,
    //             description: newone.description
    //         }
    //     }, function(err) {
    //         var state = 0;
    //         if (err) {
    //             state = 0;
    //         } else {
    //             state = 1;
    //         }
    //         callback(state);
    //     });
    // };

    return {
        login: login,
        register: register,
        Account: Account
        // update_user: update_user
    }
};