describe('E2E: Routes', function() {
	it('should load the index page', function() {
			browser().navigateTo('/#/');
			expect(browser().location().path()).toBe('/');
	});
	it('should have a sign up button', function() {
			browser().navigateTo('/#/');
			expect(element("a#login").html())
				.toEqual("Try it! Sign in");
	});
	it('should show login when clicking sign in', function() {
			browser().navigateTo('/#');
			element("a#login", "Sign in button").click();
			expect(browser().location().path()).toBe('/login');
	});

	it('should be able to fill in the user info', 
		function() {
			browser().navigateTo('/#');
			element("a#login", "Sign in button").click();
			input("user.email").enter("anna@fulls.io");
			input("user.password").enter("123123");
			element('form input[type="submit"]').click();
			expect(browser().location().path()).toBe('/dashboard');
	});
});

describe('E2E: framecontroller test', function() {
	beforeEach(function() {
		browser().navigateTo('/#/');
	});
	it('should have the date in the browser', function() {
		var d = new Date();
		expect(
			element("#time h1").html()
		).toMatch(d.getFullYear());
	});
	it('should have the user timezone in the header', function() {
		expect(element('header').html()).toMatch('US/Pacific');
	});
});


describe('E2E: test repeater', function() {
	beforeEach(function() {
		browser().navigateTo('/#/');
	});
	it('should show 10 events', function() {
		expect(
			repeater('.event_listing li').count()).toBe(10);
	});
});

describe('E2E: Views', function() {
	beforeEach(function() {
		browser().navigateTo('/#/');
	});

	it('should load the home template', function() {
		expect(
			element('#emailTable').html()
		).toContain('tbody');
	});
