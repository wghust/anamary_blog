$(document).ready(function() {
    // 编辑
    // 用户信息更新
    $(".edit_ifm").click(function(e) {
        // 设置可编辑
        var _this = $(this);
        var _this_edit = _this.data('edit');
        if (_this_edit == 0) {
            _this.html('保存');
            _this.data({
                'edit': '1'
            });
            $(".blogname").addClass('inedit').removeAttr('disabled');
            $(".description").addClass('inedit').removeAttr('disabled');
        } else {
            var data = {
                blogname: $(".blogname").val(),
                description: $(".description").val()
            };
            $.ajax({
                'type': 'POST',
                'dataType': 'json',
                'url': '/admin/saveifm',
                'data': data,
                success: function(callback) {
                    if (callback.state == 0) {
                        _this.html(callback.msg);
                    } else {
                        _this.html(callback.msg);
                        _this.html('编辑');
                        _this.data({
                            'edit': '0'
                        });
                        $(".blogname").removeClass('inedit').attr({
                            'disabled': 'disabled'
                        });
                        $(".description").removeClass('inedit').attr({
                            'disabled': 'disabled'
                        });
                    }
                }
            });
        }
        return false;
    });
    // 获取新文章列表
    var get_page_list = function(nownum) {
        var data = {
            nownum: parseInt(nownum)
        };
        // console.log(data);
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: data,
            url: '/admin/getotherart',
            success: function(callback) {
                var back = callback;
                var str = "";
                for (i = 0; i < back.length; i++) {
                    var s_str = "<tr>";
                    var k = back[i];
                    var s = "";
                    if (k.state == 0) {
                        s = "发布";
                    }
                    if (k.state == 1) {
                        s = "草稿";
                    }
                    if (k.state == 2) {
                        s = "隐私";
                    }

                    s_str += "<td><a href='/page/" + k.urltitle + "' class='one_art_name'>" + k.title + "</a></td>" +
                        "<td>" + s + "</td>" +
                        "<td>" + k.view + "</td>" +
                        "<td>" + k.cats + "</td>";
                    s_str += "<td>";
                    for (j = 0; j < k.tags.length; j++) {
                        s_str += "<a href='/tags/" + k.tags[j] + "' class='one_art_tag'>" + k.tags[j] + "</a>";
                    }
                    s_str += "<div class='clear'></div></td>";
                    s_str += "<td>" + k.date + "</td>" +
                        "<td><a href='/admin/editpage/" + k.urltitle + "' class='onebtn' data-edit='0'>编辑</a></td>";

                    str += s_str;
                }
                $(".article_table tbody").html(str);
            }
        });
    };

    var change_pagination = function(count, odlnum, nownum) {
        var str = "<ul class='pagination_ul' data-count='" + count + "' data-nownum='" + nownum + "'>";
        if (nownum != 1) {
            str += "<li><a href='#'>&laquo;</a></li>";
        }
        if (count != 1) {
            for (i = 1; i <= count; i++) {
                str += "<li>";
                if (i == nownum) {
                    str += "<a href='#' class='active'>" + i + "</a>";
                } else {
                    str += "<a href='#'>" + i + "</a>";
                }
                str += "</li>";
            }
        }
        if (nownum != count && count != 1) {
            str += "<li><a href='#'>&raquo;</a></li>"
        }
        str += "</ul><div class='clear'></div>";
        $(".pagination").html(str);
        pagination_click();
    };

    var pagination_click = function() {
        $(".pagination_ul li a").click(function(e) {
            var _this = $(this);
            var _thisparent = _this.parent('li').parent('.pagination_ul');
            var count = _thisparent.data('count');
            var oldnum = _thisparent.data('nownum');
            var nownum = _this.text();
            if (nownum == '«') {
                nownum = oldnum - 1;

            } else {
                if (nownum == '»') {
                    nownum = oldnum + 1;
                }
            }
            console.log(nownum);
            if (parseInt(nownum) != parseInt(oldnum)) {
                change_pagination(count, oldnum, nownum);
                get_page_list(nownum - 1);
            }
            return false;
        });
    };
    pagination_click();


    // cat
    clearadd = function(_this) {
        $(".onecat_name").val('');
        $(".onecat_uid").val('');
        $(".onecat_dec").val('');
        $(".onecat_parentid").val('');
        $(".cat_add").data({
            'state': true
        });
        $(".catedit").data({
            'state': true
        });
    };

    textadd = function(_this) {
        var _thistd = _this.parent('td');
        $(".onecat_name").val(_thistd.siblings('td').eq(0).children('span').text());
        $(".onecat_uid").val(_thistd.siblings('td').eq(1).text());
        $(".onecat_parentid").val(_thistd.siblings('td').eq(2).children('span').text());
        $(".onecat_dec").val(_thistd.siblings('td').eq(3).children('span').text());
    };

    beginadd = function(_this) {
        var _thisop = _this.data('op');
        if (_thisop == "inset") {
            $(".catedit").data({
                'state': false
            });
        } else {
            textadd(_this);
            $(".cat_add").data({
                'state': false
            });
            $(".catedit").data({
                'state': false
            });
            _this.data({
                'state': true
            });
        }
    };

    // show add
    showadd = function(_this, msg1, msg2) {
        console.log("this is " + _this.data('state'));
        var _this_isadd = _this.data('isadd');
        if (!_this_isadd) {
            $(".cat_block").animate({
                'margin-left': '-400px'
            }, 500, function() {
                _this.data({
                    'isadd': true
                }).text(msg1);
            });
            $(".addcatform").fadeIn(500);
            beginadd(_this);
        } else {
            $(".cat_block").animate({
                'margin-left': '0'
            }, 500, function() {
                _this.data({
                    'isadd': false
                }).text(msg2);
            });
            $(".addcatform").fadeOut(500);
            clearadd(_this);
        }
    }
    $(".cat_add").click(function(e) {
        var _this = $(this);
        if (_this.data('state') == true) {
            showadd(_this, '关闭', '添加');
        }
        return false;
    });

    // showlist
    function cat_down_show(element) {
        var _this_e = element;
        _this_e.children('input').click(function() {
            var _this_state = _this_e.children('ul').data('state');
            if (_this_state == "down") {
                _this_e.children('ul').show();
                _this_e.children('ul').data({
                    'state': 'up'
                });
            } else {
                _this_e.children('ul').hide();
                _this_e.children('ul').data({
                    'state': 'down'
                });
            }
        });
        _this_e.children('ul').children('li').click(function() {
            var _this = $(this);
            var _this_ul = _this_e.children('ul');
            _this_ul.hide();
            _this_e.children('input').val(_this.data('uid'));
            // _this_e.children('input').data({
            //     'uid': _this.data('uid')
            // });
            _this_ul.data({
                'state': 'down'
            });
        });
    }
    cat_down_show($(".cat_down"));

    function add_cat(cat) {
        // 提交
        var data = cat;
        var url = "";
        var is_wrong = false;
        if (data.uid == "") {
            url = "/admin/insertcat";
            is_wrong = msg(data);
        } else {
            url = "/admin/updatecat";
        }
        // alert(is_wrong);
        if (!is_wrong) {
            $.ajax({
                type: 'POST',
                data: data,
                dataType: 'json',
                url: url,
                success: function(callback) {
                    var data = callback;
                    if (data.state == 0) {
                        alert("添加不成功");
                    } else {
                        window.location.reload();
                    }
                }
            });
        }
    }

    function msg(cat) {
        var is_wrong = false;
        if (cat.catname == "") {
            is_wrong = true;
            return is_wrong;
        }
        if (cat.parentuid == "") {
            is_wrong = true;
            return is_wrong;
        }
        if (cat.description == "") {
            is_wrong = true;
            return is_wrong;
        }
        return is_wrong;
    }
    $(".catedit").click(function(e) {
        var _this = $(this);
        if (_this.data('state') == true) {
            showadd(_this, '关闭', '编辑');
        }
        return false;
    });

    $(".one_cat_add").click(function(e) {
        var cat = {
            'catname': $(".onecat_name").val(),
            'parentuid': $(".onecat_parentid").val(),
            'uid': $(".onecat_uid").val(),
            'description': $(".onecat_dec").val()
        };
        add_cat(cat);
        return false;
    });

    // 删除
    $(".catdelete").click(function() {
        var _this = $(this);
        var _thisparent = _this.parent('td').parent('tr');
        var _thisuid = _this.parent('td').siblings('td').eq(1).text();
        var data = {
            uid: _thisuid
        };
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: data,
            url: '/admin/catdelete',
            success: function(callback) {
                if (callback.state) {
                    _thisparent.remove();
                } else {
                    alert("删除不成功");
                }
            }
        })
    });
});