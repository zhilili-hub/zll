<?php
header('Content-Type:application/json');

//取到传递来的参数
@$kw = $_REQUEST['kw'];
if(empty($kw))
{
 echo '[]';
 return;
}

//从数据库中的kf-dish表中的$start位置 
require('init.php');


$sql = "select did,price,img_sm,material,name from kf_dish where name like '%$kw%' or material like '%$kw%'";

$result = mysqli_query($conn,$sql);

//fetch_all(php 7.0才支持) fetch_assoc
//从数据库返回的$result取结果，返回给客户端
$output = [];
while(true){
  $row = mysqli_fetch_assoc($result);
  if(!$row)
  {
    break;
  }
  $output[] = $row;
}

echo json_encode($output);




?>