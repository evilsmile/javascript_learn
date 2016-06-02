describe('Routes test', function() {
	beforeEach(module('App'));

	var location, route, rootScope;
	beforeEach(inject(
		function(_$location_, _$route_, _$rootScope_) {
			location = _$location_;
			route = _$route_;
			rootScope = _$rootScope_;
		}));

	describe('index route', function() {
		beforeEach(inject(
			function($httpBackend) {
				$httpBackend.expectGET('views/home.html')
					.repond(200, 'main HTML');
				$httpBackend.flush();
			}));
	});

	it('should load the index page on successful load of /',
		function() {
			location.path('/');
			rootScope.$digest();
			expect(route.current.controller).toBe('HomeController')
		});
	it('should redirect to the index path on non-existent route', function() {
			location.path('/def/not/a/route');
			rootScope.$digest();
			expect(route.current.controller).toBe('HomeController');
		});

});

describe('Unit controllers: ', function() {
		beforeEach(module('App'));
		describe('FrameCtroller', function() {
			var FrameCtroller, scope, timeout;
			beforeEach(inject(function($rootScope, $controller) {
				scope = $rootScope.$new();
				timeout = jasmine.createSpy('timeout');
				FrameCtroller = $controller('FrameCtroller', {$scope: scope, $timeout:timeout});
			}));
			it('should have today set', function() {
					expect(scope.time.today).toBeDefined();
					});
			it('should have a user set', function() {
					expect(scope.user).toBeDefined();
					});
			it('should set the clock a foot', function() {
					expect(timeout).toHaveBeenCalled();
					});
		});
});

describe('Unit: services', function() {
		beforeEach(module('App'));

		describe('apiKey', function() {
			var apikey;
			beforeEach(inject(function($injector) {
					apikey = $injector.get('apikey');
			}));
			it('should have the apikey as a service',
				function() {
					expect(apikey).toEqual('123445');
			});
		});

		describe('googleServices', function() {
			var googleApi, resolveValue;

			beforeEach(inject(function($injector) {
				// get service define of 'googleApi'
				googleApi = $injector.get('googleApi');
				// create a spy for function of 'gapi'
				// just used to tell us when it be called
				// won't prevent the real call
				spyOn(googleApi, 'gapi').andcallThrough();
				// set value through real function
				googleApi.gapi.then(function(keys) {
					resolveValue = keys;
				});
			}));

			describe('googleApi', function() {

			});

			var q;
			beforeEach(inject(function($injector) {
				googleApi = $injector.get('googleApi');
				q = $injector.get('$q');
				spyOn(googleApi, 'gapi').andCallFake(function() {
					var d = q.defer();
					setTimeout(function() {
							resolveValue = {
								clientId: '12345'
							}
						}, 100);
					return d.promise;
				});
				googleApi.gapi.then(function(keys) {
					resolveValue = keys;
				});
			}));
			
			beforeEach(function() {
				// wait 0.5s during resolvation of resolveValue
				waitsFor(function() {
					return resolveValue !== undefined;
				}, 500);
			});

			it('should have a gapi function', function() {
				expect(typeof(googleApi.gapi)).toEqual('function');
			});
			it('should call gapi', function() {
				expect(googleApi.gapi.callCount).toEqual(1);
			});
			it('should resolve with the browser keys', function() {
				expect(resolveValue.clientId).toBeDefined();
			});
		});
});

describe('Filter test', function() {
	var filter;
	beforeEach(module('App'));
	beforeEach(inject(function($filter) {
		filter = $filter;
	}));
	it('should give us two points', 
		function() {
			expect(filter('number')(123,2)).toEqual('123.00');
	});
	it('should filter on the search', function() {
		expect(repeater('#emailTable tbody tr')).count().toBe(2);
		input('search.x').enter('ann');
		expect(repeater('#emailTable tbody tr')).count().toBe(1);
	});
});

describe('Unit: templates', function() {
	var $httpBackend, location, route, rootScope;

	beforeEach(module('App'));
	beforeEach(inject(function(_$rootScope_, _$route_, _$location_, _$httpBackend_) {
			location = _$location_;
			route = _$route_;
			rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_;
		}));
	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it('loads the home templates at /', function() {
		$httpBackend.expectGET('views/login.html').respond(200);
		location.path('/');
		rootScope.$digest();
		$httpBackend.flush();
	});
})

describe('Unit: Directives', function() {
	var ele, scope;
	beforeEach(module('App'));

	beforeEach(inject(function($compile, $rootScope) {
		scope = $rootScope;
		ele = angular.element(
				'<div notification my-message="note"></div>');
		$compile(ele)(scope);
		scope.$apply();
	}));
	
	it('should display the welcome txt', function() {
		scope.$apply(function() {
			scope.note = "Notification message";
		});
		expect(ele.html()).toContain("Notification message");
	});

});
