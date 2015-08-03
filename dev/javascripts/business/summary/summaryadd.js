$(document).ready(function() {
    addOne = function() {
        _athis = this;
        _athis.catId = $(".summary_add").data('catid');
    };
    addOne.prototype = {
        _init: function() {
            _athis._op();
            var url = window.location.href;
            var _index = url.lastIndexOf('#');
            if (_index != -1) {
                var _pageList = $(".summary_link");
                var _thisId = url.substring(_index + 1, url.length);
                console.log(_thisId);
                var _thisNum = -1;
                for (var i = 0; i < _pageList.length; i++) {
                    if (_pageList.eq(i).attr('id') == _thisId) {
                        _pageList.eq(i).css({
                            'border': '1px solid red',
                            'border-radius': '5px'
                        });
                        _thisNum = i;
                        break;
                    }
                }
                if (_thisNum != -1) {
                    setTimeout(function() {
                        _pageList.eq(_thisNum).css({
                            'border-width': 0,
                            'border-radius': 0
                        });
                    }, 5000);
                }
            }
        },
        _showSelectPanel: function() {
            $(".summary_selectaddTypePanel").show();
            $(".summary_add").data({
                'type': 1
            });
            $(".summary_add").text('取消');
        },
        _hideSelectPanel: function() {
            $(".summary_selectaddTypePanel").hide();
            $(".summary_add").data({
                'type': 0
            });
            $(".summary_add").text('添加');
            _athis._initPanel();
        },
        _checkUrl: function(url) {
            var reg = /((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig;
            if (reg.test(url)) {
                return true;
            } else {
                return false;
            }
        },
        _checkIsOk: function() {
            var url = $.trim($(".summary_linkshow").val());
            if (_athis._checkUrl(url)) {
                return true;
            } else {
                alert("url错误");
                return false;
            }
        },
        _addWant: function(ele, _id) {
            $.ajax({
                url: '/summary/one/want',
                data: {
                    _id: _id
                },
                dataType: 'json',
                type: 'POST',
                success: function(callback) {
                    if (callback.state) {
                        var oldNum = parseInt(ele.data('wantnum'));
                        var newNum = oldNum + 1;
                        ele.data({
                            'wantnum': newNum
                        });
                        ele.html("&nbsp;" + newNum + "想看");
                    } else {
                        alert("想看失败");
                    }
                }
            })
        },
        _op: function() {
            $("body").on('click', '.summary_want', function(e) {
                var _id = $(this).parent('.summary_link').data('sumid');
                _athis._addWant($(this), _id);
                return false;
            });

            $(".summary_add").click(function(e) {
                var type = $(this).data('type');
                if (type == 0) {
                    _athis._showSelectPanel();
                } else {
                    _athis._hideSelectPanel();
                }
                return false;
            });

            $(".addLinks").click(function() {
                if (_athis._checkIsOk()) {
                    $(".addLinks").text('添加中');
                    $.ajax({
                        url: "/summary/one/add",
                        type: "POST",
                        dataType: "json",
                        data: {
                            type: 0,
                            catid: _athis.catId,
                            onelink: {
                                url: $.trim($(".summary_linkshow").val()),
                                desc: $.trim($(".summary_linkdesc").val())
                            }
                        },
                        success: function(callback) {
                            var back = callback;
                            if (back.state) {
                                var newLink = back.newLink;
                                var show = {
                                    _id: newLink._id,
                                    url: newLink.surl,
                                    title: newLink.sname,
                                    desc: newLink.sdesc,
                                    date: newLink.sdate
                                };
                                var template = $("#newLink").html();
                                Mustache.parse(template);
                                var rendered = Mustache.render(template, show);
                                $(".summary_nav").after(rendered);
                                $(".addLinks").text('添加成功');
                                setTimeout(function() {
                                    $(".addLinks").text('添加链接');
                                    _athis._hideSelectPanel();
                                }, 500);
                            } else {
                                alert("添加失败");
                            }
                        }
                    })
                }
            });
        },
        _initPanel: function() {
            $(".summary_linkshow").val("http://");
            $(".summary_linkdesc").val('');
        }
    };

    var newAdd = new addOne();
    newAdd._init();
});