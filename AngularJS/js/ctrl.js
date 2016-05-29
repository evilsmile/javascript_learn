//创建新的模块,配置interpolate的自定义开始结束符号
angular.module('emailParser', [])
.config(['$interpolateProvider', function($interpolateProvider) {
		$interpolateProvider.startSymbol('__');
		$interpolateProvider.endSymbol('__');
}]).factory('EmailParser', ['$interpolate', function($interpolate) {
		return {
			parse: function(text, context) {
				var template = $interpolate(text);
				return template(context);
			}
		};
}]);

var app = angular.module('App', []);
//var app = angular.module('App', ['ngMessages']);
//var app = angular.module('App', ['emailParser']);

app.run(function($rootScope, $timeout) {
	$rootScope.name = "Anna";

	$rootScope.isDisabled = true;

	//1s后显示指定的textarea
	$timeout(function() {
		$rootScope.isDisabled = false;
		$rootScope.myHref = "http://baidu.com";
		$rootScope.imgSrc = "imgs/1.JPG";

	}, 5000);
});

app.directive('ensureUnique', function($http) {
	return {
		require: 'ngModel',
		link: function(scope, ele, attrs, c) {
			scope.$watch(attrs.ngModel, function(n) {
				if (!n) return ;
				$http({
					method: 'POST',
					url: '/api/check' + attrs.ensureUnique,
					data: {
						field:attrs.ensureUnique,
						value: scope.ngModel
					}
				}).success(function(data) {
					c.$setValidity('unique', data.isUnique);
				}).error(function(data) {
					c.$setValidity('unique', true);
					//c.$setValidity('unique', false);
				});
			});
		}
	};
});

app.directive('ensureUnique2', function($http) {
	return {
		require: 'ngModel',
		link: function(scope, ele, attrs, ctrl) {
			var url = attrs.ensureUnique;
			ctrl.$parsers.push(function(val) {
				if (!val || val.length == 0) {
					return;
				}

				ngModel.$setValidity('checkingAvailability', true);
				ngModel.$setValidity('usernameAvailability', true);

				$http({
					method: 'GET',
					url: url,
					params: {
						username: val,
					}
				}).success(function() {
					ngModel.$setValidity('checkingAvailability', false);
					ngModel.$setValidity('usernameAvailability', true);
				})['catch'](function() {
					ngModel.$setValidity('checkingAvailability', false);
					ngModel.$setValidity('usernameAvailability', false);
				});
				return val
			});
		}
	};
});

//ngModel - DOM - selfLink 三重连接(DOM中的new-url值是ng-model绑定的变量，
//然后在selfLink中申明scope中的my
app.directive('selfLink', function() {
		return {
			restrict: 'EA',
			replace: false,
			scope: {
				inputUrl: '=newUrl', //绑定策略
				myLinkText: '@', //绑定策略
			},
			template: '<a href="{{ inputUrl }}">{{ myLinkText }}</a>',
		};
});

app.directive('selfLinks', function() {
		return {
			restrict: 'EA',
			replace: false,
			scope: {
				myUrls: '@', //绑定策略
				myLinkTexts: '@', //绑定策略
			},
			template: '<a href="{{ myUrls }}">{{ myLinkTexts }}</a>',
		};
});

//添加指令，用于元素获取焦点时才显示错误信息
app.directive('ngFocus', [function() {
	var FOCUS_CLASS = 'ng-focused';
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, ele, attrs, c) {
			c.$focused = false;
			ele.bind('focus', function(evt) {
				ele.addClass(FOCUS_CLASS);
				scope.$apply(function() {
					c.$focused = true;
				});
			}).bind('blur', function(evt) {
				ele.removeClass(FOCUS_CLASS);
				scope.$apply(function() {
					c.$focused = false;
				});
			});
		}
	};
}]);

app.directive('sidebox', function() {
		return {
			restrict: "EA",
			scope: {
				title: '@',
			},
			transclude: true,
			template: '<div class="sidebox"> \
				<div class="content"> \
					<h2 class="header">{{title}}</h2> \
					<span class="content" ng-transclude>\
					</span> \
				</div> \
			</div>'
		};
	}
);

app.directive('link', function() {
	return {
		restrict: "EA",
		transclude: true,
		controller: 
			function($scope, $element, $transclude, $log) {
				$transclude(function(clone) {
					var a = angular.element('<a>');
					a.attr('href', clone.text());
					a.text(clone.text());
					$log.info("Create a new tag in link directive");
					$element.append(a);
				});
			}
		compile: function(tEle, tAttr, transcludeFun) {
			var tplEl = angular.element('<div>' + 
					'<h2></h2>' +
					'</div>';
			var h2 = tplEl.find('h2);
			h2.attr('type', tAttrs.type);
			h2.attr('ng-model', tAttrs.ngModel);
			h2.val('hello');
			tEle.replaceWith(tplEl);
			return function(scope, ele, attrs) {
			};
		};
	});

app.controller('SimpleController', function() {
	this.name =  "Anna";
});

//app.controller('AppController', ['$scope', '$parse', 'EmailParser', function ($scope, $parse, EmailParser) {
app.controller('AppController', ['$scope', '$parse',  function ($scope, $parse ) {

		$scope.clock = {
			now : new Date(),
		};	

		$scope.g_cnt = 88888;
		$scope.g_s = 'g_s';
		$scope.cnt = {
			n: 2,
			s: "init",
		};

		$scope.people = [
			{name: 'Ari', city: "San Fran"},
			{name: 'Anna', city: "China"},
		];

var updateClock = function() {
	$scope.clock.now = new Date();
};
setInterval(function() {
		$scope.$apply(updateClock);
		}, 1000);

this.add = function(n) {
	$scope.cnt.n = $scope.cnt.n + n;
	$scope.cnt.s = 'parent';
};	

this.sub = function(n) {
	$scope.cnt.n = $scope.cnt.n - n;
	$scope.cnt.s = "parent";
};

$scope.$watch('expr', function(newVal, oldVal) {
				if (newVal !== oldVal) {
				var parseFun = $parse(newVal);
				$scope.parsedExpr = parseFun($scope);
				}
				});

/*
   $scope.$watch('emailBody', function(body) {
   if (body) {
   $scope.previewText = EmailParser.parse(body, 
   {to: $scope.to});
   }
   });
   */

$scope.isCap = function(str) {
		return str[0] == str[0].toUpperCase();
}

}]);

app.controller('signupController', function($scope) {
				$scope.submitted = false;
				$scope.signupForm = function() {
				if ($scope.signup_form.$valid) {
				alert("ok");
				} else {
				$scope.signup_form.submitted = true;
				}
				}
				});

var app2 = angular.module('App');

app2.controller('SubAppController', ['$scope', function($scope) {
				// reset parent scope's value
				$scope.resetCount = function() {
				$scope.cnt.n = 2382;
				$scope.cnt.s = 'child';
				$scope.g_cnt = 2111;
				$scope.g_s = 'cccc';
			};
		}]);

