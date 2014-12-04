$(document).ready(function() {
    // 添加tags
    var _this_tags = $(".tags_input");
    _this_tags.keypress(function(e) {
        var btn_code = e.which;
        if (btn_code === 13) {
            var tags = _this_tags.val();
            var tagsarray = [];
            tagsarray = tags.split(/[;；]/);
            $.each(tagsarray, function(index, val) {
                var nowtags = val;
                if (nowtags != "") {
                    var oldtags_length = $(".show_tags a").length;
                    var ishas = 0;
                    for (var i = 0; i < oldtags_length; i++) {
                        if (nowtags.toLowerCase() === $(".show_tags a").eq(i).text().toLowerCase()) {
                            ishas = 1;
                        }
                    }
                    if (ishas == 0) {
                        $(".show_tags").append("<a href='javascript:void(0)' class='nowtags'>" + nowtags + "</a>");
                        $(".nowtags").click(function(e) {
                            $(this).remove();
                            return fasle;
                        });
                    }
                }
            });
            _this_tags.val('');
        }
    });

    // 编辑器
    var editor = CodeMirror.fromTextArea(document.getElementById("write_text"), {
        mode: 'markdown',
        lineWrapping: true,
        // lineNumbers: true,
        theme: "default",
        extraKeys: {
            "Enter": "newlineAndIndentContinueMarkdownList"
        }
    });
    // editor.setOption("theme", "monokai");

    // 计数
    editor.on('keyup', function() {
        var content_num = editor.getValue().length;
        $(".write_wordsnum").text(content_num);
    });

    // 预览
    $(".preview_btn").click(function() {
        var _this = $(this);
        var _this_state = _this.data('state');
        if (_this_state == 0) {
            $(".show_preview").animate({
                'left': '0'
            }, 500);
            _this.data('state', 1);
            _this.text("关闭预览");
            $(".show_preview").html(marked(editor.getValue()));

        } else {
            $(".show_preview").animate({
                'left': '100%'
            }, 500);
            _this.data('state', 0);
            _this.text("预览");
            $(".show_preview").html("");
        }
    });

    // 栏目选择
    $(".cat_select").click(function() {
        var _this = $(".write_cat");
        if (_this.css("display") == 'none') {
            _this.slideDown();
        } else {
            _this.slideUp();
        }
    });

    $(".write_cat_select ul li").click(function() {
        var _this = $(this);
        if (_this.hasClass('select')) {
            _this.removeClass('select');
        } else {
            _this.addClass('select');
        }
    });

    // 文章状态
    $(".art_state").click(function() {
        var _this = $(".write_state");
        if (_this.css("display") == 'none') {
            _this.slideDown();
        } else {
            _this.slideUp();
        }
    });

    $(".write_state_select ul li").click(function() {
        var _this = $(this);
        if (_this.hasClass('select')) {
            _this.removeClass('select');
        } else {
            $(".write_state_select ul li").removeClass('select');
            _this.addClass('select');
        }
    });

    // 保存
    $(".write_save").click(function(e) {

        // tags
        var tags = "";
        for (i = 0; i < $(".show_tags a").length; i++) {
            if (i == 0) {
                tags = $(".show_tags a").eq(i).html();
            } else {
                tags += "," + $(".show_tags a").eq(i).html();
            }
        }

        // 栏目
        var cats = "";
        var num = 0;
        var catlist = $(".write_cat_select ul li");
        for (i = 0; i < catlist.length; i++) {
            if (catlist.eq(i).hasClass('select')) {
                if (num == 0) {
                    cats = catlist.eq(i).data('bigcat') + "_" + catlist.eq(i).html();
                } else {
                    cats += "," + catlist.eq(i).data('bigcat') + "_" + catlist.eq(i).html();
                }
                num++;
            }
        }

        // 发布状态
        /*
         *   0:发布
         *   1:草稿
         *   2:隐私
         */
        var state = 0;
        state = $(".write_state_select ul li.select").data('state');


        // alert(editor.getValue());
        var art_data = {
            title: $(".write_title_in").val(),
            content: editor.getValue(),
            tags: tags,
            cats: cats,
            state: parseInt(state)
        };
        // console.log(art_data.tags);
        $.ajax({
            type: 'POST',
            url: '/admin/article_save',
            data: art_data,
            dataType: 'json',
            success: function(callback) {
                var back = callback;
                if (back.state) {
                    $(".write_msg").html(back.msg);
                    setTimeout(function() {
                        window.location.href = "../../";
                    }, 2000);
                } else {
                    $(".write_msg").html(back.msg);
                }
            }
        });
        return false;
    });
});