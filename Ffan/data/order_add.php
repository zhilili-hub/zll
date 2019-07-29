<?php
header('Content-Type:application/json');
$output = [];
@$userid = $_REQUEST['userid'];
@$phone = $_REQUEST['phone'];
@$user_name = $_REQUEST['user_name'];
@$addr = $_REQUEST['addr'];
@$totalprice = $_REQUEST['totalprice'];
@$cartDetail = $_REQUEST['cartDetail'];
$order_time = time()*1000;   //PHP中的time()函数返回当前系统时间对应的整数值

if(empty($userid) || empty($user_name) || empty($phone) || empty($addr) || empty($totalprice) || empty($cartDetail)){
    echo "[]"; //若客户端提交信息不足，则返回一个空数组，
    return;    //并退出当前页面的执行
}

//访问数据库
require('init.php');


$sql = "insert into kf_order values(null,'$userid','$phone','$user_name','$order_time','$addr','$totalprice')";
$result = mysqli_query($conn, $sql);

$arr = [];
if($result){    //INSERT语句执行成功，需要获取新产生的订单id
    $oid = mysqli_insert_id($conn); //获取最近执行的一条INSERT语句生成的自增主键
    //json数据转换为json数组
    $cart = json_decode($cartDetail);
    foreach ($cart as &$one ) {
        //将数据插入到购物车详情
        $sql = "insert into kf_orderdetails values('$oid','$one->did','$one->dishCount','$one->price')";
        $result = mysqli_query($conn, $sql);
        //从购物车中删除
        $sql = "DELETE FROM kf_cart WHERE ctid=$one->ctid";
        $result = mysqli_query($conn,$sql);
    }

    $arr['msg'] = 'succ';
    $arr['reason'] = "订单生成成功";
    $arr['oid'] = $oid;
}else{          //INSERT语句执行失败
    $arr['msg'] = 'error';
    $arr['reason'] = "订单生成失败";
}
$output[] = $arr;
echo json_encode($output);
?>
