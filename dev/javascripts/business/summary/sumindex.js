$(document).ready(function() {
    addCat = function() {
        _cthis = this;
    };
    addCat.prototype = {
        _init: function() {
            var config = {
                duration: 1000,
                delay: 200
            };

            // Initialise Waves with the config
            Waves.init();
            Waves.attach('.waves-image');
            Waves.attach('.pagebtn');
            _cthis._op();
        },
        _op: function() {
            $(".sumcatbgin").click(function() {
                $(".sumcatbginfile").click();
            });

            // 上传图片
            $(".sumcatbginfile").change(function() {
                var file = $(this)[0].files[0];
                var fileType = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
                if (_cthis._checkIsFile(fileType)) {
                    _cthis._uploadImage(file, fileType);
                } else {
                    alert("请选择图片文件");
                }
            });

            // 添加栏目按钮
            $(".summary_cataddbtn").click(function(e) {
                if (!$(this).hasClass('disable')) {
                    $(this).addClass('disable');
                    $(".addcatpanel").animate({
                        'right': 0
                    }, 'slow');
                }
                return false;
            });

            // 保存栏目
            $(".sumcatsave").click(function(e) {
                _cthis._saveCat();
                return false;
            });

            // 切换栏目
            $(".sumcattypein option").click(function() {
                var _thisid = $(this).data('id');
                $(".sumcattypein").data({
                    id: _thisid
                });
            });

            $(".sumcatcancel").click(function(e) {
                $(".addcatpanel").animate({
                    'right': '-420px'
                }, 'slow', function() {
                    _cthis._initCatPanel();
                });
                return false;
            });

            $(".one_summary_image").click(function(e) {
                var url = $(this).siblings('.one_summary_desc').children('a').attr('href');
                setTimeout(function() {
                    window.open(url);
                }, 200);
            });
        },
        _checkIsFile: function(type) {
            if (type != ".jpeg" && type != ".jpg" && type != ".png") {
                return false;
            } else {
                return true;
            }
        },
        _uploadImage: function(file, fileType) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
                var fileName = (new Date()).getTime() + 'langting' + parseInt(Math.random() * 20) + fileType;
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/summary/catimage/add',
                    data: {
                        imageData: e.target.result,
                        imageName: fileName
                    },
                    success: function(callback) {
                        var back = callback;
                        if (back.state == true) {
                            $(".sumcatbginimg").attr({
                                src: back.imgurl
                            });
                            $(".sumcatbginimg").show();
                        } else {
                            alert("上传失败");
                        }
                    }
                })
            };
        },
        _getCat: function() {
            var onecat = {
                cattype: {
                    typeid: $(".sumcattypein option:selected").data('id'),
                    typename: $(".sumcattypein option:selected").val()
                },
                catname: $.trim($(".sumcatnamein").val()),
                catdesc: $.trim($(".sumcatdescin").val()),
                catbg: $(".sumcatbginimg").attr('src')
            }
            return onecat;
        },
        _checkCat: function(cat) {
            var isOk = true;
            if (cat.catname == "") {
                alert("请添加名称");
                isOk = false;
            } else {
                if (cat.catbg == "") {
                    alert("请上传图片");
                    isOk = false;
                }
            }
            return isOk;
        },
        _initCatPanel: function() {
            $(".sumcatnamein").val('');
            $(".sumcatdescin").val('');
            $(".sumcatbginimg").attr({
                src: ''
            });
            $(".sumcatbginimg").hide();
            $(".summary_cataddbtn").removeClass('disable');
        },
        _saveCat: function() {
            var onecat = _cthis._getCat();
            if (_cthis._checkCat(onecat)) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        newcat: onecat
                    },
                    url: '/summary/cat/add',
                    success: function(callback) {
                        if (callback.state) {
                            alert("保存成功");
                            $(".addcatpanel").animate({
                                'right': '-420px'
                            }, 'slow', function() {
                                _cthis._initCatPanel();
                                window.location.reload();
                            });
                        } else {
                            alert("保存失败，请稍后保存");
                        }
                    }
                });
            }
        }
    };

    var newCat = new addCat();
    newCat._init();
});