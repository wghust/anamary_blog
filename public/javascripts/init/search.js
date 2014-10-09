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
        // console.log(_this.scrollTop());
    });
});