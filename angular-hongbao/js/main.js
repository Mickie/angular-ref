var pro = angular.module('promotion', []);
pro.controller('defCtrl', function ($scope,$http) {
    var page = ['init', 'success', 'dup', 'end', 'accex'];
    $scope.curPage = page[0];
    $scope.datas=[];

    $scope.getVoteList = function () { //获取朋友列表
        var config = {
            transformResponse: function (res) {
                var r = JSON.parse(res);
                if (r) {
                    var items = [];
                    for (var i = 0, len = r.length; i < len; i++) {
                        items.push(
                            {
                                'name': r[i].name,
                                'time': r[i].time,
                                'comment':r[i].comment,
                                'score': r[i].score
                            }
                        )
                    }
                    return items;
                } else {
                    return false;
                }
            }
        };

        $http.get('data.json',config).then(function (res) { //more info
            $scope.datas = res.data;
        },function (res) {
            alert(res.statusText);
        });
    }

    $scope.getVoucher = function () { //获取红包信息
        $http.get('vdata.json').then(function (res) {
            $scope.vdata = res.data;
            $scope.curPage = page[1];
        },function () {
            alert('网络繁忙，请刷新再试');
        })
    }

    $scope.showBox = function () {
        $scope.curPage = page[4];
    }

    //init
    $scope.getVoteList();

    if ($scope.curPage == 'success') {
        $scope.getVoucher();
    }
});

pro.directive('cell', function (inputValidator, $timeout) {
    return {
        restrict: 'EA',
        templateUrl: 'input.html',
        scope:{
            'votes':'&' ,
            'voucher':'&',
            'curPage':'=page'
        },
        link: function (scope, element, attrs) {
 //           $timeout(function () { // using timeout or ngShow for workaround
                var inputEl = element.find('input'),
                    btn = element.find('button'),
                    msg = element.find('p');

                element.on('input', function () {
                    var result = inputValidator.isInputValid(inputEl, msg) || false;
                    if (result) {
                        btn.removeClass('disabled');
                    } else {
                        btn.addClass('disabled');
                    }
                    btn.attr('disabled', !result);
                });

                btn.on('click', function () {
                    btn.attr('disabled', true);
                    btn.addClass('disabled');
                    var phone = inputEl.val();
                    //httpRequest
                    if (1) {
                        inputEl.val("");
                        //mimic server side update lists
                        scope.$apply(function(){
                            scope.votes();
                            scope.voucher();
                            scope.curPage = "success";
                        })
                    } else {
                        btn.removeClass('disabled');
                        btn.attr('disabled', false);
                        msg.text('＊具体错误原因');
                    }
                });
                inputEl.on('focus', function () {
                    inputEl.val("");
                });
//            })
        }
    }
});

pro.factory('inputValidator', function () {
    return {
        isInputValid: function (obj, msg) { //jqlite
            var max = obj.attr('max'),
                len = obj.val().length;
            if (len >= 1) {
                if (len >= max) {
                    obj.val(obj.val().substr(0, max));
                    var valid = this.isNum(obj.val());
                    if (!valid) {
                        msg.text("＊请输入有效手机号码");
                    }
                    return valid;
                } else {
                    msg.text("");
                    return false;
                }
            } else {
                obj.attr('placeholder', '输入手机号');
                return false;
            }
        },
        isNum: function (str) {
            for (var i = 0; i < str.length; i++) {
                if (Number(str[0]) !== 1) {
                    return false;
                } else {
                    if (isNaN(Number(str[i]))) {
                        return false;
                    }
                }
            }
            return true;
        }
    }
});