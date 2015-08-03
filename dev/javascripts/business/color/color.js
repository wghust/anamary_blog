$(document).ready(function() {
    var isTouch = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click';
    var _on = $.fn.on;
    $.fn.on = function() {
        arguments[0] = (arguments[0] === 'click') ? isTouch : arguments[0];
        return _on.apply(this, arguments);
    };
    colorme = function() {
        _cthis = this;
        _cthis.colorValue = {
            colorRbg: "",
            colorDesc: ""
        };
    };
    colorme.prototype = {
        _init: function() {
            $(".oneColor").css({
                'height': $(".oneColor").width() + 'px'
            });
            $(window).resize(function() {
                $(".oneColor").css({
                    'height': $(".oneColor").width() + 'px'
                });
            });
            _cthis._op();
        },
        _getColorValue: function() {
            _cthis.colorValue = {
                colorRbg: $(".colorin").val(),
                colorDesc: $(".colordesc").val()
            };
        },
        _op: function() {
            $(".colorsubmit").click(function() {
                _cthis._ajaxto();
            });

            $("body").on('click', '.oneColorRotate', function() {
                var _color = $(this).css('background-color');
                $("title").text(_color);
                document.title = _color;
                $("body").css({
                    'transition': 'all 0.25s',
                    '-webkit-transition': 'all 0.25s',
                    'background-color': _color
                });
            });
        },
        _ajaxto: function() {
            _cthis._getColorValue();
            if (_cthis.colorValue.colorRbg == "") {
                alert("添加颜色");
            } else {
                $.ajax({
                    url: '/color/add',
                    data: {
                        onecolor: _cthis.colorValue
                    },
                    dataType: 'json',
                    type: 'POST',
                    success: function(callback) {
                        if (callback.color != null) {
                            // alert(callback.message);
                            _cthis._addOne(callback.color.colorRbg);
                            $(".colorin").val('');
                            $(".colordesc").val('');
                        } else {
                            alert(callback.message);
                        }
                    }
                });
            }
        },
        _addOne: function(onecolor) {
            var str = "<div class='oneColor'>" +
                "<div class='oneColorRotate' style='background-color:" + onecolor + "'>" +
                "</div>" +
                "<div class='oneColorDetail'>" +
                "<span>" + onecolor + "</span>" +
                "</div>" +
                "</div>";
            $(".color_con .clear").before(str);
        }
    };
    var newColor = new colorme();
    newColor._init();
});