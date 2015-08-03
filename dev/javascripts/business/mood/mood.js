$(document).ready(function() {
    $(".mood_submit").click(function() {
        var mood_content = $(".mood_in").val();
        if (mood_content == "") {
            $(".mood_msg").html("内容为空");
        } else {
            var data = {
                content: mood_content
            };
            console.log(data);
            $.ajax({
                type: 'POST',
                url: '/admin/mind',
                dataType: 'json',
                data: data,
                success: function(callback) {
                    if (callback.state) {
                        $(".mood_msg").html(callback.msg);
                    } else {
                        $(".mood_msg").html(callback.msg);
                        setTimeout(function() {
                            window.location.href = "/";
                        }, 1000);
                    }
                }
            })
        }
    });
});