<?php
	header("Content-Type:text/html;charset=utf-8");
	@$uname=$_REQUEST['uname']or die("用户名是必须的");
	@$upwd=$_REQUEST['upwd']or die("密码是必须的");
	@$recNumber=$_REQUEST['recNumber']or die("推荐号是必须的");
	$conn=mysqli_connect('127.0.0.1','root','','TuNiu');
	mysqli_query($conn,'SET NAMES UTF8');
	$sql="INSERT INTO tn_register values(null,'$uname','$upwd','$recNumber')";
	$result=mysqli_query($conn,$sql);
	if($result===true){ 
		echo "1";
	}else{
		echo "-1";
	}
?>