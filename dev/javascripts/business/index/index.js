// var duoshuoQuery = {
//     short_name: "anamary"
// };
// $(document).ready(function() {
//     $(".page_name").click(function(e) {
//         var thisUrl = $(this).attr('href');
//         $.get(thisUrl, function(data) {
//             // console.log($(data).filter('.ds-thread').html());
//             var oldcon = $(".container");
//             oldcon.html('');
//             oldcon.fadeOut(300, function() {
//                 var newcon = $(data).filter('.container').html();
//                 oldcon.html(newcon);


//                 var ds = document.createElement('script');
//                 ds.type = 'text/javascript';
//                 ds.async = true;
//                 ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.unstable.js';
//                 ds.charset = 'UTF-8';
//                 (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ds);

//                 history.replaceState('', '', thisUrl);
//                 oldcon.fadeIn(300);
//             });
//         });
//         return false;
//     });
// });