$(document).ready(function() {
    // $(".")
    $(window).scroll(function() {
        var _this = $(window);
        var _thisScroll = _this.scrollTop();
        if (_thisScroll > 60) {
            $(".header").addClass('get');
            $(".w_search").addClass('getshow');
        } else {
            $(".header").removeClass('get');
            $(".w_search").removeClass('getshow');
        }
    });

    var _isleft = 0;
    $(".w_search").keydown(function(e) {
        if (e.which == 13) {
            showsearch();
        } else {
            // if (e.which == 27) {
            //     closesearch();
            // }
        }
    });

    $(".closesearch").click(function(e) {
        closesearch();
        return false;
    });

    $(window).keydown(function(e) {
        if (_isleft == 1) {
            if (e.which == 27) {
                closesearch();
            }
        }
    });

    // show searchpanel
    function showsearch() {
        if (_isleft == 0) {
            $(".closesearch").show();
            $(".container").animate({
                'left': '-100%'
            }, 500, function() {
                $(this).hide();
                $(".searchpage").fadeIn();
            });
            _isleft = 1;
        }

        search();
    }

    // close searchpanel
    function closesearch() {
        if (_isleft == 1) {
            $(".container").show();
            $(".searchpage").fadeOut(300);
            $('.w_search').val('');
            $(".container").animate({
                'left': '0%'
            }, 500, function() {
                _isleft = 0;
                $(".closesearch").hide();
            });
        }
    }

    function search() {
        var sword = $('.w_search').val();
        $(".s_top_con").text(sword);
        var data = {
            sword: sword
        };
        $.ajax({
            'type': 'POST',
            'url': '/search',
            'data': data,
            'dataType': 'json',
            success: function(callback) {
                var str = "";
                var isresult = 0;

                // pages
                var pages = callback[0];
                if (pages.length != 0) {
                    pages.forEach(function(page, index) {
                        str += "<div class='s_block'>" +
                            "<div class='s_title'>" +
                            "<a href='/page/" + page.urltitle + "'>" + page.title + "</a>" +
                            "<span class='s_time'>" + page.date + "</span>" +
                            "</div>" +
                            "<div class='s_tag'>";
                        // console.log(page.tags);
                        if (page.tags != "") {
                            var thistags = page.tags.split(',');
                            thistags.forEach(function(tag, index) {
                                str += "<a href='/tags/" + tag + "'>" + tag + "</a>";
                            });
                        }
                        str += "<div class='clear'></div></div>" +
                            "<div class='s_con'>" + page.content +
                            "</div></div>";
                    });
                    isresult = 1;
                } else {}

                // moods
                var moods = callback[1];
                if (moods.length != 0) {
                    moods.forEach(function(mood, index) {
                        str += "<div class='s_block'>" +
                            "<div class='s_title'>" +
                            "<span class='s_time'>" + mood.date + "</span>" +
                            "</div>" +
                            "<a href='/mood/" + mood.urltitle + "' class='s_con_a'><div class='s_con'>" + mood.content +
                            "</div></a></div>";
                    });
                } else {
                    if (isresult == 0) {
                        str += "<div class='s_block'>" +
                            "<div class='s_title'>" +
                            "<a href='/index'>sorry，没有结果哦</a>" +
                            "</div></div>";
                    }
                }

                str += "<div class='clear'></div>";
                $(".s_container").html(str);
            }
        });
    }
});