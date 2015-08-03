module.exports = function(config, mongoose) {
    var ColorSchema = new mongoose.Schema({
        colorRbg: {
            type: String
        },
        colorDesc: {
            type: String
        }
    });

    var Color = mongoose.model('Color', ColorSchema);

    var isColorExistByRbg = function(thisRbg, callback) {
        Color.find({
            colorRbg: thisRbg
        }).exec(function(err, results) {
            if (results.length == 0) {
                callback(0);
            } else {
                callback(1);
            }
        });
    }

    var insertColor = function(oneColor, callback) {
        isColorExistByRbg(oneColor.colorRbg, function(state) {
            if (state) {
                callback(null, "已经存在了");
            } else {
                var newColor = new Color({
                    colorRbg: oneColor.colorRbg,
                    colorDesc: oneColor.colorDesc
                });
                newColor.save(function(err) {
                    if (err) {
                        callback(null, "保存失败");
                    } else {
                        callback(newColor, "保存成功");
                    }
                });
            }
        });
    };

    var getAllColor = function(callback) {
        Color.find().exec(function(err, results) {
            if (err) {
                callback(null);
            } else {
                callback(results);
            }
        });
    };

    return {
        insertColor: insertColor,
        getAllColor: getAllColor
    }
}