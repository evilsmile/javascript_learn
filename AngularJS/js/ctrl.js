var app = angular.module('App', []);

app.run(function($rootScope) {
	$rootScope.name = "Anna";
});

app.controller('AppController', ['$scope', '$timeout', function($scope) {
		$scope.clock = {
			now : new Date(),
		};	
		$scope.cnt = 0;
		var updateClock = function() {
			$scope.clock.now = new Date();
		};
		setInterval(function() {
			$scope.$apply(updateClock);
			}, 1000);
		var add = function(n) {
			$scope.cn = $scope.cnt + n;
		}	
		var sub = function(n) {
			$scope.cn = $scope.cnt - n;
		}
 }]);

var app2 = angular.module('App');

app2.controller('AppCtrl2', ['$scope', '$timeout', function($scope) {
		$scope.clock = {
			now : new Date(),
		};	
		var updateClock = function() {
			$scope.clock.now = new Date();
		};
		setInterval(function() {
			$scope.$apply(updateClock);
			}, 1000);
 }]);

