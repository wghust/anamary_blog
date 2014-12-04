module.exports = function(mongoose, pinyin, moment, marked) {
    var BlogSchema = new mongoose.Schema({
        email: {
            type: String
        },
        blogname: {
            type: String
        },
        description: {
            type: String
        }
    });
    var Blog = mongoose.model('blog', BlogSchema);

    // 插入数据
    blog_ifm_save = function(ifm, callback) {
        var blog = new Blog({
            email: ifm.email,
            blogname: ifm.blogname,
            description: ifm.description
        });
        blog.save(function(err) {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    };

    // 更新数据
    blog_ifm_update = function(ifm, callback) {
        Blog.update({
            email: ifm.email
        }, {
            $set: {
                blogname: ifm.blogname,
                description: ifm.description
            }
        }, function(err) {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    };

    // 获取博客信息
    blog_ifm_get = function(callback) {
        Blog.findOne(function(err, result) {
            if (err) {
                callback(null);
            } else {
                callback(result);
            }
        });
    };

    // 查询是否存在
    blog_ifm_exist = function(ifm, callback) {
        Blog.find({
            email: ifm.email
        }, function(err, results) {
            // console.log('blog' + results.length);
            if (results.length == 0) {
                callback(false);
            } else {
                callback(true);
            }
        });
    };

    // 信息入口函数
    blog_init = function(ifm, callback) {
        // 判断是否存在
        blog_ifm_exist(ifm, function(state) {
            // console.log(state);
            if (state) {
                blog_ifm_update(ifm, function(state) {
                    if (state) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            } else {
                blog_ifm_save(ifm, function(state) {
                    if (state) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            }
        });
    };

    return {
        blog_init: blog_init,
        blog_ifm_get: blog_ifm_get
    };
};