var isUnameValidate=false;
var isUpwdValidate=false;
var isRecnumberValidate=false;
var isValiCode=false;
var isChecked=false;
$(function() {
    $('.error').hide();
    //验证手机号
    $("#uname").blur(function() {
        var uReg=/^(13|15|18)\d{9}$/;
        var uname = $("#uname").val();
        if (!uReg.test(uname)) {
            $("#uname").next().show();
            isUnameValidate=false;
        }else{
            $("#uname").next().hide();
            isUnameValidate=true;
        }
        if(isUnameValidate&&isUpwdValidate&&isRecnumberValidate&&isValiCode&&isChecked)
            $("#bt-register").css({
                background:"green",
                cursor:"pointer"
            });
    });
    //验证密码
    $("#upwd").blur(function () {
        var pReg=/^\w{6,12}$/i;
        var upwd=$("#upwd").val();
        if(!pReg.test(upwd)){
            $("#upwd").next().show();
        }else{
            $("#upwd").next().hide();
            isUpwdValidate=true;
        }
        if(isUnameValidate&&isUpwdValidate&&isRecnumberValidate&&isValiCode&&isChecked)
            $("#bt-register").css({
                background:"green",
                cursor:"pointer"
            });
    });
    //验证推荐手机号
    $("#recNumber").blur(function() {
        var uReg=/^(13|15|18)\d{9}$/;
        var recNumber = $("#recNumber").val();
        if (!uReg.test(recNumber)) {
            $("#recNumber").next().show();
            return false;
        }else{
            $("#recNumber").next().hide();
            isRecnumberValidate=true;
        }
        if(isUnameValidate&&isUpwdValidate&&isRecnumberValidate&&isValiCode&&isChecked)
            $("#bt-register").css({
                background:"green",
                cursor:"pointer"
            });
    });
    });
var currentCode='';
//产生验证码
window.onload=createCode;
function createCode(){
    var code="";
    var codeLength=4;
    var checkCode=document.getElementById("code");
    var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',
        'S','T','U','V','W','X','Y','Z');
    for(var i=0;i<codeLength;i++){
        var index=Math.floor(Math.random()*36);//取随机数索引
        code+=random[index];
    }
    checkCode.value=code;
    currentCode=code;
}

//验证验证码
$("#input").blur(function validate(){
    var inputCode = document.getElementById("input").value.toUpperCase();
    if(inputCode != currentCode) {
        $("#code").next().show();
        $("#input").value= "";
        isValiCode=false;
    } else {
        isValiCode=true;
        $("#code").next().hide();
    }
    if(isUnameValidate&&isUpwdValidate&&isRecnumberValidate&&isValiCode&&isChecked)
        $("#bt-register").css({
            background:"green",
            cursor:"pointer"
        });
});


$("#chk").click(function () {
   isChecked=$("#chk").prop("checked");
    if(isUnameValidate&&isUpwdValidate&&isRecnumberValidate&&isValiCode&&isChecked)
        $("#bt-register").css({
            background:"green",
            cursor:"pointer"
        });
});

//下一步单击事件

$("#bt-register").click(function () {
    if(isUnameValidate&&isUpwdValidate&&isRecnumberValidate&&isValiCode&&isChecked){
        $("#bt-register").css({
            background:"green",
            cursor:"pointer"
        });
    }
    //进行ajax传值
    $.ajax({
        url : "data/register.php",
        type : "post",
        data: {
            uname: $("#uname").val(),
            upwd: $("#upwd").val(),
            recNumber:$("#recNumber").val
        },
        success : function(msg) {
            console.log(msg);
            if(msg==1){
                $("#hint").css("display","block");
                setTimeout(function(){
                   location.href="login.html";
                },3000);
            }
        }
    });
});
