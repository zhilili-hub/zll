var isUnameValidate=false;
var isUpwdValidate=false;
$(function() {
    $('p').hide();
    //验证手机号
    $("#uname").blur(function () {
        var uReg = /^(13|15|18)\d{9}$/;
        var uname = $("#uname").val();
        if (!uReg.test(uname)) {
            $("#uname").next().show();
        } else {
            $("#uname").next().hide();
            isUnameValidate = true;
        }
        if (isUnameValidate && isUpwdValidate)
            $("#login-btn").css({
                background: "#22C231",
                cursor: "pointer"
            });
    });
    //验证密码
    $("#upwd").blur(function () {
        var pReg = /^\w{6,12}$/i;
        var upwd = $("#upwd").val();
        if (!pReg.test(upwd)) {
            $("#upwd").next().show();
        } else {
            $("#upwd").next().hide();
            isUpwdValidate = true;
        }
        if (isUnameValidate && isUpwdValidate)
            $("#login-btn").css({
                background: "#22C231",
                cursor: "pointer"
            });
    });
});
$("#login-btn").click(function () {
    if (isUnameValidate && isUpwdValidate ) {
        $("#login-btn").css({
            background: "#22C231",
            cursor: "pointer"
        });
    }
    //进行ajax传值
    $.ajax({
        url : "data/login.php",
        type : "post",
        data: {
            uname: $("#uname").val(),
            upwd: $("#upwd").val()
        },
        success : function(msg) {
            if(msg==1){
                $("#hint").css("display","block")
                            .html("登录成功，欢迎"+$("#uname").val()+"回来！页面将在3秒后跳转至首页...");
                //sessionStorage['uname']=$("#uname").val();
                sessionStorage.setItem("uname", $('#uname').val());
                setTimeout(function(){
                    location.href="index.html";
                },3000);
            }
        }
    });
});