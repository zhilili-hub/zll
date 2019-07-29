/**
 * Created by bjwsl-001 on 2017/7/10.
 */

var app = angular.module('kfl', ['ionic']);

app.config(
  function ($ionicConfigProvider, $stateProvider, $urlRouterProvider) {

    //将tabs固定在页面底部(默认在Android是在顶部)
    $ionicConfigProvider.tabs.position('bottom');

    $stateProvider
      .state('start', {
        url: '/kflStart',
        templateUrl: 'tpl/start.html'
      })
      .state('main', {
        url: '/kflMain',
        templateUrl: 'tpl/main.html',
        controller: 'mainCtrl'
      })
      .state('detail', {
        url: '/kflDetail/:did',
        templateUrl: 'tpl/detail.html',
        controller: 'detailCtrl'
      })
      .state('order', {
        url: '/kflOrder/:price',
        templateUrl: 'tpl/order.html',
        controller: 'orderCtrl'
      })
      .state('myOrder', {
        url: '/kflMyOrder',
        templateUrl: 'tpl/myOrder.html',
        controller: 'myOrderCtrl'
      })
      .state('settings', {
        url: '/kflSettings',
        templateUrl: 'tpl/settings.html',
        controller: 'settingsCtrl'
      })
      .state('cart',{
        url:'/kflCart',
        templateUrl:'tpl/cart.html',
        controller:'cartCtrl'
      })

    $urlRouterProvider.otherwise('/kflStart');

  })


app.service('$kflHttp',
  ['$ionicLoading', '$http', function ($ionicLoading, $http) {
    this.sendRequest = function (url, func) {
      $ionicLoading.show({
        template: '加载中..'
      })

      $http.get(url).success(function (data) {
        func(data);
        $ionicLoading.hide();
      })

    }

  }]);


app.controller('bodyCtrl', ['$scope', '$state', function ($scope, $state) {

  $scope.jump = function (desState, args) {
    $state.go(desState, args);
  }

}])

app.controller('mainCtrl', ['$scope', '$kflHttp',
  function ($scope, $kflHttp) {
    $scope.dishList = [];
    $scope.hasMore = true;
    // $scope.kw = '';
    $scope.inputTxt = {kw: ''};

    //请求服务器端拿数据
    /*  $http
     .get('data/dish_getbypage.php')
     .success(function (data) {
     console.log(data);
     $scope.dishList = data;
     })*/
    $kflHttp.sendRequest(
      'data/dish_getbypage.php',
      function (data) {
        $scope.dishList = data;
      }
    )

    //处理加载更多
    $scope.loadMore = function () {


      /*$http.get('data/dish_getbypage.php?start=' + $scope.dishList.length)
       .success(function (data) {

       if (data.length < 5) {
       $scope.hasMore = false;
       }
       $scope.dishList = $scope.dishList.concat(data);
       })*/
      $kflHttp.sendRequest(
        'data/dish_getbypage.php?start=' + $scope.dishList.length,
        function (data) {
          if (data.length < 5) {
            $scope.hasMore = false;
          }
          $scope.dishList = $scope.dishList.concat(data);
          $scope.$broadcast('scroll.infiniteScrollComplete')
        }
      )
    }

    //处理搜索
    $scope.$watch('inputTxt.kw', function (newValue, oldValue) {
      console.log(newValue, oldValue);
      if (newValue.length > 0) {
        /* $http
         .get('data/dish_getbykw.php?kw=' + newValue)
         .success(function (data) {
         console.log(data);
         if(data.length>0)
         {
         $scope.dishList = data;
         }
         })*/
        $kflHttp.sendRequest(
          'data/dish_getbykw.php?kw=' + newValue
          ,
          function (data) {
            console.log(data);
            if (data.length > 0) {
              $scope.dishList = data;
            }
          }
        )
      }
    });
  }
])

app.controller('detailCtrl',
  ['$scope', '$kflHttp',
    '$stateParams', '$ionicPopup',
    function ($scope, $kflHttp, $stateParams, $ionicPopup) {
      //接收到参数
      console.log($stateParams);
      $kflHttp.sendRequest(
        'data/dish_getbyid.php?did=' + $stateParams.did,
        function (data) {
          console.log(data);
          $scope.dish = data[0];
        }
      )

      $scope.addToCart = function () {
        //发起网络请求，请求cart_update.php
        $kflHttp.sendRequest(
          'data/cart_update.php?uid=1&count=-1&did=' + $stateParams.did,
          function (result) {
            console.log(result);
            if (result.msg == 'succ') {
              $ionicPopup.confirm({
                template: '成功添加到购物车'
              })
            }
          }
        )
      }


    }])

app.controller('orderCtrl',
  ['$scope', '$kflHttp', '$stateParams', '$httpParamSerializerJQLike',
    function ($scope, $kflHttp, $stateParams, $httpParamSerializerJQLike) {
      console.log($stateParams);

      $scope.submitResult = "";

      $scope.order = {
        userid:1,
        user_name: '',
        sex: '',
        phone: '',
        addr: '',
        totalprice: $stateParams.price,
        cartDetail:sessionStorage.getItem('cartDetail')
      }

      //$httpParamSerializerJQLike
      $scope.submitOrder = function () {
        //验证当前用户输入数据的完整性
        console.log($scope.order);
        //如果数据是完整的，可以将对象处理成urlEncoded字符串：sex=1&addr=&...
        var result = $httpParamSerializerJQLike($scope.order);
        console.log(result);
        //发给服务器
        $kflHttp.sendRequest(
          'data/order_add.php?' + result,
          function (data) {
            console.log(data);
            if (data) {
              if (data[0].msg == 'succ') {
                $scope.submitResult = "下单成功，订单编号为:" + data[0].oid;
              }
              else if (data.msg == 'error') {
                $scope.submitResult = "下单失败";
              }
            }
          }
        )
      }

    }])

app.controller('myOrderCtrl',
  ['$scope', '$kflHttp',
    function ($scope, $kflHttp) {
      $scope.orderList = [];
      //取得下单成功时的手机号
      var myPhone = sessionStorage.getItem('phone');
      console.log(myPhone);
      //根据手机号 发起网络请求，拿数据回来
      $kflHttp.sendRequest(
        'data/order_getbyuserid.php?userid=1',
        function (result) {
          console.log(result)
          $scope.orderList = result.data;
        }
      )
    }])

app.controller('settingsCtrl',
  ['$scope', '$ionicModal',
    function ($scope, $ionicModal) {

      //创建模态窗口
      $ionicModal
        .fromTemplateUrl
      (
        'tpl/about.html',
        {
          scope: $scope
        }
      )
        .then(function (window) {
          $scope.aboutModal = window;
        })
      //定义相关的方法
      $scope.showAbout = function () {
        $scope.aboutModal.show();
      }

      $scope.hideModal = function () {
        $scope.aboutModal.hide();
      }

    }
  ]
)

app.controller('cartCtrl',
  ['$scope','$kflHttp','$ionicPopup',
    function ($scope,$kflHttp,$ionicPopup) {
      $scope.cart = [];
      $scope.editText = "编辑";
      $scope.editEnanbled = true;

      //切换编辑状态的方法
      $scope.toggleEditStatus = function () {
        if($scope.editEnanbled)
        {
          $scope.editText = "完成";
        }
        else
        {
          $scope.editText = "编辑";
        }
        $scope.editEnanbled =
          !$scope.editEnanbled;
      }

      //定义一个保存购物车详情并跳转的方法
      $scope.saveAndJump = function () {
        //保存 sessionStorage
        sessionStorage.setItem(
          'cartDetail',
          angular.toJson($scope.cart)
        )
        //跳转
        $scope.jump(
          'order',
          {price:$scope.sumAll()}
        );
      }

      //定义数据和方法
      $kflHttp.sendRequest(
        'data/cart_select.php?uid=1',
        function (result) {
          console.log(result);
          $scope.cart = result.data;
        }
      )

      //计算总和
      $scope.sumAll = function () {
        var totalPrice = 0;
        for(var i=0;i<$scope.cart.length;i++)
        {
          var dish = $scope.cart[i];
          totalPrice+=(dish.price*dish.dishCount);
        }
        return totalPrice;
      }


      //从购物车中减少数量
      $scope.minusFromCart = function (index) {
        var count = $scope.cart[index].dishCount;
        if(count > 1)
        {
          count--;
          $kflHttp.sendRequest(
            'data/cart_update.php?uid=1&did='+$scope.cart[index].did+"&count="+count,
            function () {
              $scope.cart[index].dishCount--;
              $ionicPopup.confirm({
                template:'更新成功'
              })
            }
          )
        }

      }
      //向购物车中增加数量
      $scope.plusToCart = function (index) {
        var count = $scope.cart[index].dishCount;
        count++;
        $kflHttp.sendRequest(
          'data/cart_update.php?uid=1&did='+$scope.cart[index].did+"&count="+count,
          function (data) {
            $scope.cart[index].dishCount++;
            $ionicPopup.confirm({
              template:'更新成功'
            })
          }
        )
      }

  }]);








