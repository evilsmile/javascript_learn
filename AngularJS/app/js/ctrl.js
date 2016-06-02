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

//#declare
var app = angular.module('App', ['ngRoute']);
//var app = angular.module('App', ['ngMessages']);
//var app = angular.module('App', ['emailParser']);

//#run
app.run(function($rootScope, $timeout, $http, $location, $window) {
	$rootScope.name = "Anna";

	$rootScope.isDisabled = true;

	$rootScope.$on('$routeChangeStart', function(evt, next, current) {
			console.log('Route change start!' + next + '  ' + current);
	});
	$rootScope.$on('$routeChangeSuccess', function(evt, next, current) {
			console.log('Route change success!' + next + '  ' + current);
	});
	$rootScope.$on('$routeChangeError', function(evt, previous, rejection) {
			console.log('Route change error!' + previous + '  ' + rejection);
	});

//	$location.path('/views/hello.html');
	console.log('absUrl' +$location.absUrl());
	console.log('hash:' + $location.hash());
	console.log('host:' + $location.host());
	console.log('port:' + $location.port());
	console.log('protocol:' + $location.protocol());
	console.log('search:' + $location.search());
	console.log('url:' + $location.url());
//	$location.url('http://baidu.com');
//	$window.location.href = '/views/hello.html';

	//1s后显示指定的textarea
	$timeout(function() {
		$rootScope.isDisabled = false;
		$rootScope.myHref = "http://baidu.com";
		$rootScope.imgSrc = "imgs/1.JPG";

	}, 5000);

	/* // not work
	$rootScope.$apply(function() {
		$http({
			method: 'GET',
			url: 'http://baidu.com'
		});
	});
	*/
});

//#service
var Person = function() {
	this.getName = function() {
		return "new generation";
	};
};

app.service('personService', Person);

//#constant
app.constant('apikey', '123445');

//#value
app.value('apikey2', '1234888885');

//#decorator
var greeterDecrator = function($delegate, $log) {
	var pre_greet = function() {
		console.log("Say pre-hi");
	};
	return {
		greet: pre_greet,
	};
};
//#factory
app
.factory('GithubService', ['$q', '$http',
	function($q, $http) {
		var getPullRequest = function() {
			var deferred = $q.defer();
			$http.get('https://api.github.com/repos/angular/angular.js/.pulls')
				.success(function(data) {
						deferred.reslove(data);
				}).error(function(reason) {
						deferred.reject(reason);
				});
			return deferred.promise;
		}
		return {
			getPullRequest: getPullRequest
		};
}])
/*
.factory('greeter', function(apikey, apikey2) {
	return {
		greet: function(msg) { console.log(msg + '. ' + apikey + '. ' + apikey2); }
	};
})
*/
//与上面的工厂方法等价
.provider('greeter', {
	$get: function() {
		return {
			greet: function(msg) {console.log(msg); }
		};
	}
})
.config(function($provide) {
	$provide.decorator('greeter', greeterDecrator);
})
.factory('GithubAPIService', function($http) {
	var githubUrl = "https://api.github.com";
	var runUserRequest = function(username, path) {
		return $http({
			method: 'JSONP',
			url: githubUrl + '/users/' + username + '/' + path + '?callback=JSON_CALLBACK',
		});
	};
	return {
		events: function(username) {
			return runUserRequest(username, 'events');
			},
		getGithubUrl: function() {
			return githubUrl;
		},
		setGithubUrl: function(url) {
			console.log("new github url: " + url);
			githubUrl = url;
		},

	}
}).controller('UseFacController', ['$scope', '$timeout', '$http', 'greeter', 'GithubAPIService', 'personService', function($scope, $timeout, $http, greeter, GithubAPIService, personService) {
	$scope.sayHello = function($http) {
		console.log("get name from personService: " + personService.getName());
		greeter.greet('Hello');
		GithubAPIService.setGithubUrl('sss');
	};

	$scope.githubUrl = GithubAPIService.getGithubUrl();
	var timeout;
	$scope.$watch("github.username", function(newUsername) {
			$scope.githubUrl = GithubAPIService.getGithubUrl();
			if (newUsername) {
				if (timeout) $timeout.cancel(timeout);
				timeout = $timeout(function() {
					GithubAPIService.events(newUsername)
					.success(function(data, status, headers) {
							$scope.github.events = data.data;
					});
				}, 1000);
			}
	});
}]);

//#config
app.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(false);
	$locationProvider.hashPrefix('+');
}]);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'views/main.html',
			controller: 'HomeController'})
		.when('/', {
			templateUrl: 'views/login.html',
			controller: 'LoginController'})
		/*
		.when('/', {
			templateUrl: 'angular_test.html',
			controller: 'AppController'
		})
		.when('angular_test.html', {
			templateUrl: 'views/hello.html'
		})
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'AppController',
			resolve: {
				'data': ['$http', function($http) {
					return $http.get('/faked').then(
						function sucess(resp) { return resp.data; },
						function error(reason) { return false; }
					);
				}]
			}
		})
		*/
		.otherwise({
			redirectTo: ''
		})
		;
}]);

app
.controller('HomeController', function($route) {
		console.log('This is Home Controller');
})
.controller('LoginController', function() {
		console.log('This is Login Controller');
})
.controller('FrameCtroller', function($scope, $timeout) {
		$scope.time = {
			today: new Date()
		};
		$scope.user = {
			timezone: 'US/Pacific'
		};
		var updateClock = function() {
			$scope.time.today = new Date();
		};
		var tick = function() {
			$timeout(function() {
				$scope.$apply(updateClock);
				tick();
			}, 1000);
		}
		tick();
});

//#directive
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
			},
		compile: function(tEle, tAttr, transcludeFun) {
			var tplEl = angular.element('<div><h2></h2></div>');
			var h2 = tplEl.find('h2');
			h2.attr('type', tAttrs.type);
			h2.attr('ng-model', tAttrs.ngModel);
			h2.val('hello');
			tEle.replaceWith(tplEl);
			return function(scope, ele, attrs) {
			};
		},
	}
});

app.directive('myNgDirect', function() {
	return {
		require: "?ngModel",
		link: function(scope, ele, attrs, ngModel) {
			if (!ngModel) return;
			ngModel.$render = function() {
				ele.html(ngModel.$viewValue() || 'None');
			};

			$(function() {
				ele.datepicker({
					onSelect: function(date) {
						scope.$apply(function() {
							ngModel.$setViewValue(date);
						});
					},
				});
			})
		}
	};
})

app.directive('notification', function($timeout) {
	var html = '<div class="notification">' +
			'<div class="notification-content">' +
				'<p>{{ myMessage }}</p>' +
			'</div>' +
			'</div>';
	return {
		restrict: 'A',
		scope: { myMessage: '=' },
		template: html,
		replace: true,
		link: function(scope, ele, attrs) {
			scope.$watch('myMessage', function(n, o) {
				if (n) {
					$timeout(function() {
						ele.addClass('ng-hide');
					}, 20000);
				}
			});
		},
}});


//#controller
app.controller('SimpleController', function($scope) {
	this.name =  "Anna";
	
});

//app.controller('AppController', ['$scope', '$parse', 'EmailParser', function ($scope, $parse, EmailParser) {
app.controller('AppController', ['$scope', '$parse', '$location', function ($scope, $parse , $location) {

		// Event test
		// -- start --
		$scope.$on('$viewContentLoaded',  function(evt) {
			console.log('include content loaded!');
		});
		$scope.$on('$locationChangeStart',  function(evt) {
			console.log('locate change start!');
		});

		$location.path('/views/home.html');

		// -- end --

		$scope.clock = {
			now : new Date(),
		};	
		$scope.myEmails = [
			{ from : 'lj@evil.com', subject : 'rain day' },
			{ from : 'ann@evil.com', subject : 'sunny day' },
		];
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

