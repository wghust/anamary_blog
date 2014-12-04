module.exports = function(pinyin) {
    var change = function(name) {
        var ch_title = new Array();
        var en_title = '';
        ch_title = pinyin(name, {
            style: pinyin.STYLE_NORMAL
        });
        for (var i = 0; i < ch_title.length; i++) {
            if (i == 0) {
                en_title += ch_title[i][0];
            } else {
                en_title += "-" + ch_title[i][0];
            }
        }
        // console.log(en_title);
        callback(en_title);
    }
    return {
        change: change
    };
};