/*! anamary_blog 2015-07-05;author: wangbinbin;nickname:done;blog: newblog.tecclass.cn;company:kaixun*/
$(document).ready(function(){var a="ontouchstart"in document.documentElement?"touchstart":"click",b=$.fn.on;$.fn.on=function(){return arguments[0]="click"===arguments[0]?a:arguments[0],b.apply(this,arguments)},colorme=function(){_cthis=this,_cthis.colorValue={colorRbg:"",colorDesc:""}},colorme.prototype={_init:function(){$(".oneColor").css({height:$(".oneColor").width()+"px"}),$(window).resize(function(){$(".oneColor").css({height:$(".oneColor").width()+"px"})}),_cthis._op()},_getColorValue:function(){_cthis.colorValue={colorRbg:$(".colorin").val(),colorDesc:$(".colordesc").val()}},_op:function(){$(".colorsubmit").click(function(){_cthis._ajaxto()}),$("body").on("click",".oneColorRotate",function(){var a=$(this).css("background-color");$("title").text(a),document.title=a,$("body").css({transition:"all 0.25s","-webkit-transition":"all 0.25s","background-color":a})})},_ajaxto:function(){_cthis._getColorValue(),""==_cthis.colorValue.colorRbg?alert("添加颜色"):$.ajax({url:"/color/add",data:{onecolor:_cthis.colorValue},dataType:"json",type:"POST",success:function(a){null!=a.color?(_cthis._addOne(a.color.colorRbg),$(".colorin").val(""),$(".colordesc").val("")):alert(a.message)}})},_addOne:function(a){var b="<div class='oneColor'><div class='oneColorRotate' style='background-color:"+a+"'></div><div class='oneColorDetail'><span>"+a+"</span></div></div>";$(".color_con .clear").before(b)}};var c=new colorme;c._init()});