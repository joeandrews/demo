'use strict';

angular.module('call-carrot', ['ngRoute', 'call-carrot-main', 'templates', 'restangular'])
	.config(function($routeProvider, RestangularProvider) {
		RestangularProvider.setBaseUrl('http://joeandrews91-call-carrot-backend.nodejitsu.com');
		// $sailsProvider.url = 'http://joeandrews91-call-carrot-backend.nodejitsu.com:80';
		$routeProvider
			.when('/signup', {
				templateUrl: 'components/signup/templates/signup.html',
				controller: 'SignupCtrl'
			})
			.when('/login', {
				templateUrl: 'components/login/templates/login.html',
				controller: 'LoginCtrl'
			})
			.when('/dashboard', {
				templateUrl: 'components/dashboard/templates/dashboard.html',
				controller: 'DashboardCtrl'
			})
			.when('/interested', {
				templateUrl: 'components/interested/templates/interested.html',
				controller: 'InterestedCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	}).controller("headerCtrl", ['$scope', 'Auth', '$location',
		function($scope, Auth, $location) {

			// $sails.get("/session")
			// 	.success(function(data) {
			// 		console.log(data);
			// 		$scope.bars = data;
			// 	})
			// 	.error(function(data) {
			// 		alert('Houston, we got a problem!');
			// 	});


			// $sails.on("message", function(message) {
			// 	if (message.verb === "create") {
			// 		$scope.bars.push(message.data);
			// 	}
			// });

			$scope.Auth = Auth;
			Auth.checkStatus().then(function(u) {
				// $sails.get("/session")
				// 	.success(function(data) {
				// 		console.log(data);
				// 		$scope.bars = data;
				// 	})
				// 	.error(function(data) {
				// 		alert('Houston, we got a problem!');
				// 	});
				$location.path('/dashboard');
			}, function() {
				$location.path('/login');
			});
		}
	]);
angular.module('call-carrot').factory('Auth', ['Restangular', '$location',
	function(Restangular, $location) {
		var currentUser = null;

		return {
			login: function(credentials) {
				Restangular.setDefaultHttpFields({
					withCredentials: true
				});
				return Restangular.all('login').post(credentials).then(function(u) {
					currentUser = u;
				}, function(e) {
					console.log(e);
				});
			},
			checkStatus: function(argument) {
				Restangular.setDefaultHttpFields({
					withCredentials: true
				});
				return Restangular.one('session').get().then(function(u) {

					currentUser = u;
				}, function(e) {
					console.log(e);
				});
			},
			logout: function() {
				Restangular.setDefaultHttpFields({
					withCredentials: true
				});
				return Restangular.one('logout').get().then(function(u) {
					currentUser = null;
					$location.path('/');
				}, function(e) {
					console.log(e);
				});
			},
			isLoggedIn: function() {
				return currentUser ? true : false;
			},
			currentUser: function() {
				return currentUser;
			}
		};
	}
]);
'use strict';

angular.module('call-carrot-main', ['ngRoute'])
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'main/main.html',
				controller: 'HeaderCtrl'
			});
	})
	.controller('HeaderCtrl', ['$scope',
		function($scope) {
			$.backstretch("http://piciandpici.com/wp-content/uploads/2012/04/call-center3.jpg");



		}
	]);
'use strict';
angular.module('call-carrot').controller('DashboardCtrl', ['$scope', 'Auth',

	function($scope, Auth) {

		$scope.onCall = false;
		$scope.ringing = false;
		$scope.status = 'Idle';

		function toggleOverlay() {
			var triggerBttn = document.querySelector('body'),
				overlay = document.querySelector('div.overlay');
			var transEndEventNames = {
				'WebkitTransition': 'webkitTransitionEnd',
				'MozTransition': 'transitionend',
				'OTransition': 'oTransitionEnd',
				'msTransition': 'MSTransitionEnd',
				'transition': 'transitionend'
			},
				transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
				support = {
					transitions: Modernizr.csstransitions
				};
			if (classie.has(overlay, 'open')) {
				classie.remove(overlay, 'open');
				classie.add(overlay, 'close');
				var onEndTransitionFn = function(ev) {
					if (support.transitions) {
						if (ev.propertyName !== 'visibility') return;
						this.removeEventListener(transEndEventName, onEndTransitionFn);
					}
					classie.remove(overlay, 'close');
				};
				if (support.transitions) {
					overlay.addEventListener(transEndEventName, onEndTransitionFn);
				} else {
					onEndTransitionFn();
				}
			} else if (!classie.has(overlay, 'close')) {
				classie.add(overlay, 'open');
			}
		};
		$scope.$watch(Auth.isLoggedIn, function(isLoggedIn) {
			$scope.isLoggedIn = isLoggedIn;
			$scope.currentUser = Auth.currentUser();
			if (isLoggedIn) {
				initDashboard();
			};
		});
		// if (Auth.currentUser()) {
		// 	$scope.currentUser = Auth.currentUser();
		// 	initDashboard();
		// };


		$scope.ring = function(conn) {
			console.log(conn);
			// here we have to emit a socket request to display the buisness info for a call
			// query on the from number
			$scope.status = conn.parameters.From + ' on call.';

			toggleOverlay();
			$scope.accept = function() {
				console.log('here');
				conn.accept();
				$scope.onCall = true;
				toggleOverlay();
			}
			$scope.reject = function() {
				console.log('here');
				conn.reject();
				toggleOVverlay();
			}

		};

		function initDashboard() {
			Twilio.Device.setup($scope.currentUser.TwilioCapability, {
				rtc: false
			});

			Twilio.Device.ready(function(device) {
				// The device is now ready
				console.log("Twilio.Device is now ready for connections");
				Twilio.Device.connect({
					agent: Auth.currentUser().id
				});

			});
			Twilio.Device.incoming($scope.ring);
		};



	}
]);
'use strict';
angular.module('call-carrot').controller('InterestedCtrl', ['$scope', 'Restangular', '$location', '$sails',

	function($scope, Restangular, $location, $sails) {



		function toggleOverlay() {
			var triggerBttn = document.querySelector('body'),
				overlay = document.querySelector('div.overlay');
			var transEndEventNames = {
				'WebkitTransition': 'webkitTransitionEnd',
				'MozTransition': 'transitionend',
				'OTransition': 'oTransitionEnd',
				'msTransition': 'MSTransitionEnd',
				'transition': 'transitionend'
			},
				transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
				support = {
					transitions: Modernizr.csstransitions
				};
			if (classie.has(overlay, 'open')) {
				classie.remove(overlay, 'open');
				classie.add(overlay, 'close');
				var onEndTransitionFn = function(ev) {
					if (support.transitions) {
						if (ev.propertyName !== 'visibility') return;
						this.removeEventListener(transEndEventName, onEndTransitionFn);
					}
					classie.remove(overlay, 'close');
				};
				if (support.transitions) {
					overlay.addEventListener(transEndEventName, onEndTransitionFn);
				} else {
					onEndTransitionFn();
				}
			} else if (!classie.has(overlay, 'close')) {
				classie.add(overlay, 'open');
			}
		};
		setTimeout(toggleOverlay, 10);
		$scope.user = {

		};
		$scope.submit = function() {

			Restangular.setDefaultHttpFields({
				withCredentials: true
			});
			Restangular.all('signup').post($scope.user).then(function(u) {
				$location.path("/");
			}, function(e) {
				console.log(e);
			});
		}

	}
]);
'use strict';
angular.module('call-carrot').controller('LoginCtrl', ['$scope', 'Auth', '$location',

	function($scope, Auth, $location) {


		function toggleOverlay() {
			var triggerBttn = document.querySelector('body'),
				overlay = document.querySelector('div.overlay');
			var transEndEventNames = {
				'WebkitTransition': 'webkitTransitionEnd',
				'MozTransition': 'transitionend',
				'OTransition': 'oTransitionEnd',
				'msTransition': 'MSTransitionEnd',
				'transition': 'transitionend'
			},
				transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
				support = {
					transitions: Modernizr.csstransitions
				};
			if (classie.has(overlay, 'open')) {
				classie.remove(overlay, 'open');
				classie.add(overlay, 'close');
				var onEndTransitionFn = function(ev) {
					if (support.transitions) {
						if (ev.propertyName !== 'visibility') return;
						this.removeEventListener(transEndEventName, onEndTransitionFn);
					}
					classie.remove(overlay, 'close');
				};
				if (support.transitions) {
					overlay.addEventListener(transEndEventName, onEndTransitionFn);
				} else {
					onEndTransitionFn();
				}
			} else if (!classie.has(overlay, 'close')) {
				classie.add(overlay, 'open');
			}
		};
		setTimeout(toggleOverlay, 10);
		$scope.user = {

		};
		$scope.login = function() {
			Auth.login($scope.user).then(function() {
				$location.path('/dashboard');
			});
		};

	}
]);
'use strict';
angular.module('call-carrot').controller('SignupCtrl', ['$scope', 'Restangular',

	function($scope, Restangular) {


		function toggleOverlay() {
			var triggerBttn = document.querySelector('body'),
				overlay = document.querySelector('div.overlay');
			var transEndEventNames = {
				'WebkitTransition': 'webkitTransitionEnd',
				'MozTransition': 'transitionend',
				'OTransition': 'oTransitionEnd',
				'msTransition': 'MSTransitionEnd',
				'transition': 'transitionend'
			},
				transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
				support = {
					transitions: Modernizr.csstransitions
				};
			if (classie.has(overlay, 'open')) {
				classie.remove(overlay, 'open');
				classie.add(overlay, 'close');
				var onEndTransitionFn = function(ev) {
					if (support.transitions) {
						if (ev.propertyName !== 'visibility') return;
						this.removeEventListener(transEndEventName, onEndTransitionFn);
					}
					classie.remove(overlay, 'close');
				};
				if (support.transitions) {
					overlay.addEventListener(transEndEventName, onEndTransitionFn);
				} else {
					onEndTransitionFn();
				}
			} else if (!classie.has(overlay, 'close')) {
				classie.add(overlay, 'open');
			}
		};
		setTimeout(toggleOverlay, 10);
		$scope.user = {

		};
		$scope.success = false;
		$scope.signup = function() {
			Restangular.setDefaultHttpFields({
				withCredentials: true
			});
			Restangular.all('user').post($scope.user).then(function(u) {
				console.log(u);
				$scope.success = true;
			}, function(e) {
				console.log(e);
			});
		}

	}
]);