<?php
    header("Content-Type:text/html;charset=utf-8"); 
    @$uname=$_REQUEST['uname']or die("用户名是必须的");
	@$upwd=$_REQUEST['upwd']or die("密码是必须的");
	$conn=mysqli_connect('127.0.0.1','root','','TuNiu');
	mysqli_query($conn,'SET NAMES UTF8');
	$sql="SELECT * FROM tn_register WHERE uname='$uname' AND upwd='$upwd'";
	$result=mysqli_query($conn,$sql);
	$row=mysqli_fetch_assoc($result);
	if($row===null){
		echo "0";
	}else{
		echo "1";
	}
?>