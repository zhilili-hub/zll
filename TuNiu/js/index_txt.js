//右边菜单栏中的文字上下轮播
window.onload=function(e){
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
        }else{
            s=setTimeout(lun,100);
        }
        clearInterval(s);
    }
};