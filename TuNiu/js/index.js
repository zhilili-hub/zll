//顶部小图片的滑动效果
$lis=$("#container .slider-small>li");
$lis.mouseover(function(e){
    $(this).addClass("active")
               .siblings().removeClass("active");
});
//搜索框input
$("#search input").focus(function(e){
    $(this).next().css("display","none");
});
$("#search input").blur(function(e){
    $(this).next().css("display","block");
});
//右边菜单栏中的圆圈
window.onload=function(){onload1();onload2();comment();s()};
function onload1(){
    var n=70;
    var t=setInterval(function(){
        n-=70;
        $("#right-box>.hot-point").css("background-position","1px "+n+"px");
        if(n<=-6440)
            clearInterval(t);
    },10);
}
//右边菜单栏中的文字上下轮播
function onload2(){
    var h=0;
    var s=setTimeout(lun,100);
    function lun(){
        h+=55;
        $("#text-ad>ul").css("marginTop",-h+"px");
        if(h==55||h==110||h==165||h==220){
            s=setTimeout(lun,2000);
        }else if(h>=275){
            h=0;
            s=setTimeout(lun,2000);
        }
    }
}
//右边菜单栏用户评论轮播
function comment(){
    var h=0;
    var s=setTimeout(lun,100);
    function lun(){
        h+=550;
        $("#new-comments>li:nth-child(2)").css("top",-h+"px");
        if(h==550){
            s=setTimeout(lun,2000);
        }else if(h>=1100){
            h=0;
            s=setTimeout(lun,2000);
        }
    }
}
//底部图片上下轮播
function s(){
    var h=0;
    var dir=1;
    var s=setTimeout(lun,100);
    function lun(){
        h+=dir*190;
        $("#tourism_images>ul").css("top",-h+"px");
        //console.log(1);
        if(h<=0){
            dir=1;
        }
        if(h>380){
            dir=-1;
        }
        s=setTimeout(lun,2000);
    }
}

$(function(){
    var uname=sessionStorage.getItem('uname');
    //console.log(uname);
    if(uname!=null){
        $("#wel-user").html("欢迎"+uname+"回来!");
    }
});
//菜单栏事件
$as=$("#nav>.nav-menu>ul>li>a");
$as.mouseover(function(e){
    $("#txt-menu").css("display","block");
});
$as.mouseout(function(e){
    $("#txt-menu").css("display","none");
});
//超值特卖
$as=$("#main-top>.clearfix>.content-lf>ul>li>a");
$as.mouseover(function(e){
    var id=$(e.target).attr("href");
    //console.log(id);
    $(id).addClass("show")
        .siblings().removeClass("show");
});
//当季热玩
$as=$("#main-body>.details-lf>.layer-header ul>li>a");
$as.mouseover(function(e){
    var id=$(e.target).attr("href");
    $(id).css("display","block")
        .siblings().css("display","none");
});
//出境长线
$as=$("#main-body>.details-lf>.layer2>ul.rt>li>a");
$as.mouseover(function(e){
    var id=$(e.target).attr("href");
    $(id).css("display","block")
        .siblings().css("display","none");
});
//周边旅游
$as=$("#main-body>.details-lf>.layer2>ul.travel-round>li>a");
$as.mouseover(function(e){
    var id=$(e.target).attr("href");
    $(id).css("display","block")
        .siblings().css("display","none");
});
//国内旅游
$as=$("#main-body>.details-lf>.layer2>ul.inner-travel>li>a");
$as.mouseover(function(e){
    var id=$(e.target).attr("href");
    $(id).css("display","block")
        .siblings().css("display","none");
});

//顶部大图片轮播
var imgWidth=$("#container").css("width");
var curIndex=-1;
var imgLen=$("#container>.slider img").length;
 $("#container>.slider img").css("width",imgWidth);
$("#container>.slider").css("width",parseInt(imgWidth)*imgLen+"px");
//自动切换定时器
var autoChange=setInterval(function () {
	curIndex++;
    if(curIndex<imgLen){
        changeTo(curIndex);
    }else{
        curIndex=0;
		$(".slider").css("left",0);
    }
},4000);
function changeTo(num){
    var goLeft=num*parseInt(imgWidth);
	//console.log(goLeft);
    $(".slider").animate({left:-goLeft},500);
}
//点击左右按钮轮播
$("#prev").click(()=> {
    curIndex++;
    if(curIndex<imgLen){
        var goLeft=curIndex*parseInt(imgWidth);
        $(".slider").stop(true).animate({left:-goLeft});
    }else{
        curIndex=0;
        $(".slider").css("left",0);
    }
});
$("#next").click(()=> {
    curIndex--;
    if(curIndex>=0){
        var goLeft=curIndex*parseInt(imgWidth);
        $(".slider").stop(true).animate({left:-goLeft});
    }else{
        curIndex=imgLen;
        $(".slider").css("left",0);
    }
});

//楼层滚动事件
$(()=>{
    //获得所有楼层气泡span
    var $h2s=$(
        "#main-body>.details-lf>.layer-header>h2"
    );
    var $elev=$("#elevator");
    $(window).scroll(()=>{
        var scrollTop= $("body").scrollTop();
        $h2s.each((i,h2)=>{
            var $h2=$(h2);
            if($h2.offset().top
                <scrollTop+innerHeight/2){
                $h2s.removeClass("hover");
                $h2.addClass("hover");
                $elev.find("ul>li:eq("+i+")")
                    .addClass("current")
                    .siblings()
                    .removeClass("current");
            }else{
                $h2.removeClass("hover");
            }
        });
        if($h2s.is(".hover")){
            $elev.show();
        }else{
            $elev.hide();
        }
    });
    $elev.on("click","li>a",
            e=>{
            var $li=$(e.target).parent();
            var i=$elev.find("ul>li").index($li);
            var $h2=$h2s.eq(i);
            $("body").animate({
                scrollTop:$h2.offset().top
            },500);
        }
    )
});