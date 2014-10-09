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
            callback(null != doc);
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
    return {
        login: login,
        register: register,
        Account: Account
    }
};